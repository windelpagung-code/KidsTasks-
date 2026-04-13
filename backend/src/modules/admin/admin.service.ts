import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const PRICE_MONTHLY = 19.9;
const PRICE_ANNUAL  = 118.8;

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo  = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalTenants,
      paidMonthly,
      paidAnnual,
      totalChildren,
      totalTasks,
      suspended,
      recentSignups,
      previousPeriodSignups,
      recentConversions,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { plan: 'monthly' } }),
      this.prisma.tenant.count({ where: { plan: 'annual' } }),
      this.prisma.child.count(),
      this.prisma.task.count({ where: { isActive: true } }),
      this.prisma.tenant.count({ where: { status: 'suspended' } }),
      this.prisma.tenant.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, plan: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.tenant.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      this.prisma.tenant.count({ where: { plan: { not: 'free' }, createdAt: { gte: thirtyDaysAgo } } }),
    ]);

    const freeTenants   = totalTenants - paidMonthly - paidAnnual;
    const paidTenants   = paidMonthly + paidAnnual;
    const mrr           = paidMonthly * PRICE_MONTHLY + paidAnnual * (PRICE_ANNUAL / 12);
    const arr           = paidMonthly * PRICE_MONTHLY * 12 + paidAnnual * PRICE_ANNUAL;
    const conversionRate = totalTenants > 0
      ? ((paidTenants / totalTenants) * 100).toFixed(1)
      : '0';
    const signupGrowth = previousPeriodSignups > 0
      ? (((recentSignups.length - previousPeriodSignups) / previousPeriodSignups) * 100).toFixed(1)
      : '0';

    const signupsByDay = this.buildDailyTimeseries(recentSignups, thirtyDaysAgo, now);

    return {
      totalTenants, paidTenants, paidMonthly, paidAnnual, freeTenants,
      totalChildren, totalTasks, suspended,
      conversionRate,
      mrr: mrr.toFixed(2),
      arr: arr.toFixed(2),
      newSignups30d: recentSignups.length,
      newConversions30d: recentConversions,
      signupGrowth,
      signupsByDay,
    };
  }

  async getTenants(page = 1, limit = 20, plan?: string, search?: string) {
    const skip  = (page - 1) * limit;
    const where: any = {};

    if (plan) where.plan = plan;

    if (search) {
      const t = search.trim();
      where.OR = [
        { name:  { contains: t, mode: 'insensitive' } },
        { users: { some: { email: { contains: t, mode: 'insensitive' } } } },
        { users: { some: { name:  { contains: t, mode: 'insensitive' } } } },
      ];
    }

    const [rows, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          plan: true,
          status: true,
          subscriptionStatus: true,
          currentPeriodEnd: true,
          createdAt: true,
          users: {
            where: { role: 'admin' },
            take: 1,
            select: { name: true, email: true, lastLoginAt: true },
          },
          _count: { select: { children: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    const tenants = rows.map((t) => ({
      id: t.id,
      name: t.name,
      plan: t.plan,
      status: t.status,
      subscriptionStatus: t.subscriptionStatus,
      currentPeriodEnd: t.currentPeriodEnd,
      createdAt: t.createdAt,
      email: t.users[0]?.email ?? null,
      userName: t.users[0]?.name ?? null,
      lastLoginAt: t.users[0]?.lastLoginAt ?? null,
      childrenCount: t._count.children,
    }));

    return { tenants, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getEmailExport(): Promise<string> {
    const rows = await this.prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        name: true,
        email: true,
        lastLoginAt: true,
        tenant: { select: { name: true, plan: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const header = 'nome_familia,nome_usuario,email,plano,data_cadastro,ultimo_acesso';
    const lines  = rows.map((u) => {
      const lastLogin = u.lastLoginAt ? u.lastLoginAt.toISOString().slice(0, 10) : '';
      return [
        `"${u.tenant.name}"`,
        `"${u.name}"`,
        `"${u.email}"`,
        `"${u.tenant.plan}"`,
        `"${u.tenant.createdAt.toISOString().slice(0, 10)}"`,
        `"${lastLogin}"`,
      ].join(',');
    });

    return [header, ...lines].join('\n');
  }

  async getFinanceiro() {
    const now = new Date();
    const PRICE_M = 19.9;
    const PRICE_A = 118.8;

    // Last 6 months MRR trend — count plans per month bucket
    const months: { label: string; from: Date; to: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const from = new Date(d.getFullYear(), d.getMonth(), 1);
      const to   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      months.push({
        label: from.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        from, to,
      });
    }

    const mrrTrend = await Promise.all(months.map(async (m) => {
      const [monthly, annual] = await Promise.all([
        this.prisma.tenant.count({ where: { plan: 'monthly', createdAt: { lte: m.to } } }),
        this.prisma.tenant.count({ where: { plan: 'annual',  createdAt: { lte: m.to } } }),
      ]);
      return {
        label:   m.label,
        mrr:     +(monthly * PRICE_M + annual * (PRICE_A / 12)).toFixed(2),
        monthly,
        annual,
      };
    }));

    // Pending / past_due
    const [pastDue, suspended, cancelled] = await Promise.all([
      this.prisma.tenant.findMany({
        where: { subscriptionStatus: 'past_due' },
        select: { id: true, name: true, plan: true, createdAt: true,
          users: { where: { role: 'admin' }, take: 1, select: { email: true } } },
      }),
      this.prisma.tenant.findMany({
        where: { status: 'suspended' },
        select: { id: true, name: true, plan: true, createdAt: true,
          users: { where: { role: 'admin' }, take: 1, select: { email: true } } },
      }),
      this.prisma.tenant.findMany({
        where: { subscriptionStatus: { in: ['canceled', 'cancelled'] } },
        select: { id: true, name: true, plan: true, createdAt: true,
          users: { where: { role: 'admin' }, take: 1, select: { email: true } } },
      }),
    ]);

    const [paidMonthly, paidAnnual] = await Promise.all([
      this.prisma.tenant.count({ where: { plan: 'monthly' } }),
      this.prisma.tenant.count({ where: { plan: 'annual' } }),
    ]);
    const mrr = paidMonthly * PRICE_M + paidAnnual * (PRICE_A / 12);
    const arr = paidMonthly * PRICE_M * 12 + paidAnnual * PRICE_A;

    return { mrrTrend, pastDue, suspended, cancelled, mrr, arr, paidMonthly, paidAnnual };
  }

  async getEngajamento() {
    const now = new Date();
    const ago7  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
    const ago30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      activeUsers7d,
      activeUsers30d,
      neverLoggedIn,
      tenantsWithNoChildren,
      tenantsWithNoTasks,
      totalTasks,
      approvedTasks,
      totalAssignments,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'admin', lastLoginAt: { gte: ago7 } } }),
      this.prisma.user.count({ where: { role: 'admin', lastLoginAt: { gte: ago30 } } }),
      this.prisma.user.count({ where: { role: 'admin', lastLoginAt: null } }),
      this.prisma.tenant.count({ where: { children: { none: {} } } }),
      this.prisma.tenant.count({ where: { tasks: { none: {} } } }),
      this.prisma.task.count({ where: { isActive: true } }),
      this.prisma.taskAssignment.count({ where: { status: 'approved' } }),
      this.prisma.taskAssignment.count(),
    ]);

    // Most active families (by task count — sort in memory for compatibility)
    const allFamilies = await this.prisma.tenant.findMany({
      select: {
        id: true, name: true, plan: true,
        users: { where: { role: 'admin' }, take: 1, select: { email: true, lastLoginAt: true } },
        _count: { select: { children: true, tasks: true } },
      },
    });
    const topFamilies = allFamilies
      .sort((a, b) => b._count.tasks - a._count.tasks)
      .slice(0, 10);

    const totalAdmins = await this.prisma.user.count({ where: { role: 'admin' } });
    const dormant30d  = totalAdmins - activeUsers30d;

    return {
      activeUsers7d, activeUsers30d, neverLoggedIn, dormant30d,
      tenantsWithNoChildren, tenantsWithNoTasks,
      totalTasks, approvedTasks, totalAssignments,
      completionRate: totalAssignments > 0
        ? ((approvedTasks / totalAssignments) * 100).toFixed(1)
        : '0',
      topFamilies: topFamilies.map((t) => ({
        id: t.id, name: t.name, plan: t.plan,
        email: t.users[0]?.email ?? null,
        lastLoginAt: t.users[0]?.lastLoginAt ?? null,
        childrenCount: t._count.children,
        tasksCount: t._count.tasks,
      })),
    };
  }

  async getMarketing() {
    // Segmented lists
    const [freemium, monthly, annual, inactive30d, neverLogged] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'admin', tenant: { plan: 'free' } },
        select: { name: true, email: true, lastLoginAt: true,
          tenant: { select: { name: true, plan: true, createdAt: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: { role: 'admin', tenant: { plan: 'monthly' } },
        select: { name: true, email: true, lastLoginAt: true,
          tenant: { select: { name: true, plan: true, createdAt: true, currentPeriodEnd: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: { role: 'admin', tenant: { plan: 'annual' } },
        select: { name: true, email: true, lastLoginAt: true,
          tenant: { select: { name: true, plan: true, createdAt: true, currentPeriodEnd: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: { role: 'admin', lastLoginAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        select: { name: true, email: true, lastLoginAt: true,
          tenant: { select: { name: true, plan: true, createdAt: true } } },
        orderBy: { lastLoginAt: 'asc' },
      }),
      this.prisma.user.findMany({
        where: { role: 'admin', lastLoginAt: null },
        select: { name: true, email: true, lastLoginAt: true,
          tenant: { select: { name: true, plan: true, createdAt: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      segments: {
        freemium:   { count: freemium.length,   users: freemium },
        monthly:    { count: monthly.length,     users: monthly },
        annual:     { count: annual.length,      users: annual },
        inactive30d:{ count: inactive30d.length, users: inactive30d },
        neverLogged:{ count: neverLogged.length, users: neverLogged },
      },
    };
  }

  async getSuporte() {
    const [suspended, pastDue, noChildren, noTasks, noLogin30d] = await Promise.all([
      this.prisma.tenant.findMany({
        where: { status: 'suspended' },
        select: { id: true, name: true, plan: true, status: true, createdAt: true,
          users: { where: { role: 'admin' }, take: 1, select: { email: true, lastLoginAt: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.tenant.findMany({
        where: { subscriptionStatus: 'past_due' },
        select: { id: true, name: true, plan: true, subscriptionStatus: true,
          currentPeriodEnd: true, createdAt: true,
          users: { where: { role: 'admin' }, take: 1, select: { email: true, lastLoginAt: true } } },
        orderBy: { currentPeriodEnd: 'asc' },
      }),
      this.prisma.tenant.findMany({
        where: { children: { none: {} } },
        select: { id: true, name: true, plan: true, createdAt: true,
          users: { where: { role: 'admin' }, take: 1, select: { email: true, lastLoginAt: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.tenant.findMany({
        where: { tasks: { none: {} }, children: { some: {} } },
        select: { id: true, name: true, plan: true, createdAt: true,
          _count: { select: { children: true } },
          users: { where: { role: 'admin' }, take: 1, select: { email: true, lastLoginAt: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.user.findMany({
        where: { role: 'admin', lastLoginAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        select: { name: true, email: true, lastLoginAt: true,
          tenant: { select: { id: true, name: true, plan: true } } },
        orderBy: { lastLoginAt: 'asc' },
        take: 20,
      }),
    ]);

    return {
      suspended:   suspended.map((t) => ({ ...t, email: t.users[0]?.email, lastLoginAt: t.users[0]?.lastLoginAt })),
      pastDue:     pastDue.map((t)   => ({ ...t, email: t.users[0]?.email, lastLoginAt: t.users[0]?.lastLoginAt })),
      noChildren:  noChildren.map((t)=> ({ ...t, email: t.users[0]?.email, lastLoginAt: t.users[0]?.lastLoginAt })),
      noTasks:     noTasks.map((t)   => ({ ...t, email: t.users[0]?.email, lastLoginAt: t.users[0]?.lastLoginAt, childrenCount: t._count.children })),
      noLogin30d,
    };
  }

  async suspendTenant(id: string) {
    return this.prisma.tenant.update({ where: { id }, data: { status: 'suspended' } });
  }

  async activateTenant(id: string) {
    return this.prisma.tenant.update({ where: { id }, data: { status: 'active' } });
  }

  private buildDailyTimeseries(
    rows: { createdAt: Date; plan: string }[],
    from: Date,
    to: Date,
  ) {
    const map: Record<string, { date: string; total: number; paid: number; free: number }> = {};

    const cur = new Date(from);
    while (cur <= to) {
      const key = cur.toISOString().slice(0, 10);
      map[key] = { date: key, total: 0, paid: 0, free: 0 };
      cur.setDate(cur.getDate() + 1);
    }

    rows.forEach((r) => {
      const key = r.createdAt.toISOString().slice(0, 10);
      if (map[key]) {
        map[key].total++;
        if (r.plan === 'free') map[key].free++;
        else map[key].paid++;
      }
    });

    return Object.values(map);
  }
}

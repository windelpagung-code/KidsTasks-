import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando banco de dados...');

  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.storeRedemption.deleteMany();
  await prisma.storeItem.deleteMany();
  await prisma.savingsTransaction.deleteMany();
  await prisma.savingsAccount.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.childBadge.deleteMany();
  await prisma.specialGoal.deleteMany();
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.allowancePeriod.deleteMany();
  await prisma.child.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.badge.deleteMany();

  console.log('✅ Banco limpo!');

  // ─── TENANT ────────────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.create({
    data: { name: 'Família Oliveira', plan: 'monthly', status: 'active' },
  });

  // ─── USERS ─────────────────────────────────────────────────────────────────
  const hash = await bcrypt.hash('Demo@2026', 12);

  const carlos = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Carlos Oliveira',
      email: 'carlos@demo.com',
      passwordHash: hash,
      role: 'admin',
    },
  });

  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Ana Oliveira',
      email: 'ana@demo.com',
      passwordHash: hash,
      role: 'editor',
    },
  });

  // ─── CHILDREN ──────────────────────────────────────────────────────────────
  const lucas = await prisma.child.create({
    data: {
      tenantId: tenant.id,
      name: 'Lucas',
      nickname: 'Lu',
      birthdate: new Date('2014-03-15'),
      avatarUrl: '🦁',
      level: 3,
      totalPoints: 450,
      allowanceAmount: 80,
      allowanceFrequency: 'monthly',
      allowanceRule: 'proportional',
      thresholdPercent: 70,
      allowanceDay: 5,
    },
  });

  const sofia = await prisma.child.create({
    data: {
      tenantId: tenant.id,
      name: 'Sofia',
      nickname: 'Sofi',
      birthdate: new Date('2016-07-22'),
      avatarUrl: '🦋',
      level: 2,
      totalPoints: 320,
      allowanceAmount: 60,
      allowanceFrequency: 'monthly',
      allowanceRule: 'threshold',
      thresholdPercent: 80,
      allowanceDay: 5,
    },
  });

  const pedro = await prisma.child.create({
    data: {
      tenantId: tenant.id,
      name: 'Pedro',
      nickname: 'Pe',
      birthdate: new Date('2018-11-08'),
      avatarUrl: '🚀',
      level: 1,
      totalPoints: 180,
      allowanceAmount: 40,
      allowanceFrequency: 'monthly',
      allowanceRule: 'proportional',
      thresholdPercent: 50,
      allowanceDay: 5,
    },
  });

  // ─── TASKS ──────────────────────────────────────────────────────────────────
  const t1 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Arrumar o quarto', icon: '🛏️', category: 'Casa', difficulty: 'easy', basePoints: 10, recurrenceType: 'daily', isActive: true } });
  const t2 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Estudar matemática', icon: '📐', category: 'Estudos', difficulty: 'medium', basePoints: 20, recurrenceType: 'daily', isActive: true } });
  const t3 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Fazer lição de casa', icon: '📚', category: 'Estudos', difficulty: 'medium', basePoints: 15, recurrenceType: 'daily', isActive: true } });
  const t4 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Lavar a louça', icon: '🍽️', category: 'Casa', difficulty: 'medium', basePoints: 15, recurrenceType: 'weekly', recurrenceDays: '1,3,5', isActive: true } });
  const t5 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Tirar o lixo', icon: '🗑️', category: 'Casa', difficulty: 'easy', basePoints: 10, recurrenceType: 'weekly', recurrenceDays: '2,5', isActive: true } });
  const t6 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Ler por 30 minutos', icon: '📖', category: 'Estudos', difficulty: 'easy', basePoints: 10, recurrenceType: 'daily', isActive: true } });
  const t7 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Praticar violão', icon: '🎸', category: 'Habilidades', difficulty: 'hard', basePoints: 30, recurrenceType: 'weekly', recurrenceDays: '1,4', isActive: true } });
  const t8 = await prisma.task.create({ data: { tenantId: tenant.id, createdBy: carlos.id, title: 'Ajudar a arrumar a casa', icon: '🧹', category: 'Casa', difficulty: 'medium', basePoints: 20, recurrenceType: 'weekly', recurrenceDays: '6', isActive: true } });

  // ─── TASK ASSIGNMENTS ──────────────────────────────────────────────────────
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  await prisma.taskAssignment.createMany({ data: [
    { taskId: t1.id, childId: lucas.id, periodStart, periodEnd, status: 'approved', pointsEarned: 10, completedAt: now, approvedBy: carlos.id },
    { taskId: t2.id, childId: lucas.id, periodStart, periodEnd, status: 'approved', pointsEarned: 20, completedAt: now, approvedBy: carlos.id },
    { taskId: t3.id, childId: lucas.id, periodStart, periodEnd, status: 'done', pointsEarned: 0, completedAt: now },
    { taskId: t6.id, childId: lucas.id, periodStart, periodEnd, status: 'approved', pointsEarned: 10, completedAt: now, approvedBy: carlos.id },
    { taskId: t7.id, childId: lucas.id, periodStart, periodEnd, status: 'pending', pointsEarned: 0 },
    { taskId: t4.id, childId: lucas.id, periodStart, periodEnd, status: 'approved', pointsEarned: 15, completedAt: now, approvedBy: carlos.id },
    { taskId: t1.id, childId: sofia.id, periodStart, periodEnd, status: 'approved', pointsEarned: 10, completedAt: now, approvedBy: carlos.id },
    { taskId: t3.id, childId: sofia.id, periodStart, periodEnd, status: 'approved', pointsEarned: 15, completedAt: now, approvedBy: carlos.id },
    { taskId: t5.id, childId: sofia.id, periodStart, periodEnd, status: 'done', pointsEarned: 0, completedAt: now },
    { taskId: t6.id, childId: sofia.id, periodStart, periodEnd, status: 'pending', pointsEarned: 0 },
    { taskId: t8.id, childId: sofia.id, periodStart, periodEnd, status: 'approved', pointsEarned: 20, completedAt: now, approvedBy: carlos.id },
    { taskId: t1.id, childId: pedro.id, periodStart, periodEnd, status: 'approved', pointsEarned: 10, completedAt: now, approvedBy: carlos.id },
    { taskId: t5.id, childId: pedro.id, periodStart, periodEnd, status: 'pending', pointsEarned: 0 },
    { taskId: t6.id, childId: pedro.id, periodStart, periodEnd, status: 'done', pointsEarned: 0, completedAt: now },
  ]});

  // ─── ALLOWANCE PERIODS ─────────────────────────────────────────────────────
  function monthsAgo(n: number) {
    const d = new Date();
    d.setMonth(d.getMonth() - n);
    return d;
  }

  for (const child of [
    { c: lucas, amount: 80, pts: 120 },
    { c: sofia, amount: 60, pts: 90 },
    { c: pedro, amount: 40, pts: 60 },
  ]) {
    await prisma.allowancePeriod.createMany({ data: [
      { childId: child.c.id, periodStart: monthsAgo(3), periodEnd: monthsAgo(2), targetPoints: child.pts, earnedPoints: Math.round(child.pts * 0.95), percentAchieved: 95, amountDue: child.amount * 0.95, amountPaid: child.amount * 0.95, status: 'paid', paidAt: monthsAgo(2) },
      { childId: child.c.id, periodStart: monthsAgo(2), periodEnd: monthsAgo(1), targetPoints: child.pts, earnedPoints: child.pts, percentAchieved: 100, amountDue: child.amount, amountPaid: child.amount, status: 'paid', paidAt: monthsAgo(1) },
      { childId: child.c.id, periodStart: monthsAgo(1), periodEnd: new Date(), targetPoints: child.pts, earnedPoints: Math.round(child.pts * 0.65), percentAchieved: 65, amountDue: child.amount * 0.65, amountPaid: 0, status: 'open' },
    ]});
  }

  // ─── WALLET TRANSACTIONS ───────────────────────────────────────────────────
  function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

  await prisma.walletTransaction.createMany({ data: [
    { childId: lucas.id, type: 'credit', amount: 80, pointsAmount: 0, description: 'Mesada - Fevereiro/2026', createdBy: carlos.id, createdAt: daysAgo(55) },
    { childId: lucas.id, type: 'credit', amount: 80, pointsAmount: 0, description: 'Mesada - Março/2026', createdBy: carlos.id, createdAt: daysAgo(25) },
    { childId: lucas.id, type: 'debit', amount: 15, pointsAmount: 0, description: 'Sorvete no parque 🍦', createdBy: carlos.id, createdAt: daysAgo(20) },
    { childId: lucas.id, type: 'debit', amount: 25, pointsAmount: 0, description: 'Jogo novo no celular 🎮', createdBy: carlos.id, createdAt: daysAgo(10) },
    { childId: sofia.id, type: 'credit', amount: 60, pointsAmount: 0, description: 'Mesada - Fevereiro/2026', createdBy: carlos.id, createdAt: daysAgo(55) },
    { childId: sofia.id, type: 'credit', amount: 60, pointsAmount: 0, description: 'Mesada - Março/2026', createdBy: carlos.id, createdAt: daysAgo(25) },
    { childId: sofia.id, type: 'debit', amount: 12, pointsAmount: 0, description: 'Figurinhas do álbum 📚', createdBy: carlos.id, createdAt: daysAgo(15) },
    { childId: pedro.id, type: 'credit', amount: 40, pointsAmount: 0, description: 'Mesada - Fevereiro/2026', createdBy: carlos.id, createdAt: daysAgo(55) },
    { childId: pedro.id, type: 'credit', amount: 40, pointsAmount: 0, description: 'Mesada - Março/2026', createdBy: carlos.id, createdAt: daysAgo(25) },
    { childId: pedro.id, type: 'debit', amount: 8, pointsAmount: 0, description: 'Chiclete e balinhas 🍬', createdBy: carlos.id, createdAt: daysAgo(5) },
  ]});

  // ─── STORE ITEMS ───────────────────────────────────────────────────────────
  const [sorvete, videogame, passeio, filme, dormir] = await Promise.all([
    prisma.storeItem.create({ data: { tenantId: tenant.id, name: 'Sorvete especial', icon: '🍦', description: 'Escolha um sorvete na sorveteria favorita!', pointsCost: 50, isActive: true } }),
    prisma.storeItem.create({ data: { tenantId: tenant.id, name: '1h extra de videogame', icon: '🎮', description: 'Uma hora a mais de videogame no fim de semana.', pointsCost: 80, isActive: true } }),
    prisma.storeItem.create({ data: { tenantId: tenant.id, name: 'Passeio no parque', icon: '🌳', description: 'Um passeio especial no parque da cidade.', pointsCost: 120, isActive: true } }),
    prisma.storeItem.create({ data: { tenantId: tenant.id, name: 'Escolher o filme da noite', icon: '🎬', description: 'Você escolhe o filme da pipoca em família!', pointsCost: 60, isActive: true } }),
    prisma.storeItem.create({ data: { tenantId: tenant.id, name: 'Dormir mais tarde', icon: '🌙', description: 'Pode ficar acordado(a) até meia-noite!', pointsCost: 100, isActive: true } }),
  ]);

  // ─── STORE REDEMPTIONS ─────────────────────────────────────────────────────
  await prisma.storeRedemption.createMany({ data: [
    { childId: lucas.id, itemId: videogame.id, status: 'approved', requestedAt: daysAgo(8), resolvedAt: daysAgo(7), resolvedBy: carlos.id },
    { childId: lucas.id, itemId: sorvete.id, status: 'pending', requestedAt: daysAgo(2) },
    { childId: sofia.id, itemId: filme.id, status: 'approved', requestedAt: daysAgo(5), resolvedAt: daysAgo(5), resolvedBy: carlos.id },
    { childId: sofia.id, itemId: passeio.id, status: 'pending', requestedAt: daysAgo(1) },
    { childId: pedro.id, itemId: sorvete.id, status: 'approved', requestedAt: daysAgo(10), resolvedAt: daysAgo(10), resolvedBy: carlos.id },
  ]});

  // ─── SAVINGS ACCOUNTS ──────────────────────────────────────────────────────
  const savLucas = await prisma.savingsAccount.create({ data: { childId: lucas.id, balance: 45, goalAmount: 120, goalName: 'Headphone Bluetooth 🎧' } });
  const savSofia = await prisma.savingsAccount.create({ data: { childId: sofia.id, balance: 28, goalAmount: 80, goalName: 'Kit de pintura 🎨' } });
  const savPedro = await prisma.savingsAccount.create({ data: { childId: pedro.id, balance: 15 } });

  await prisma.savingsTransaction.createMany({ data: [
    { accountId: savLucas.id, type: 'deposit', amount: 20, description: 'Guardando para o fone 🎧', createdAt: daysAgo(30) },
    { accountId: savLucas.id, type: 'deposit', amount: 25, description: 'Guardando para o fone 🎧', createdAt: daysAgo(5) },
    { accountId: savSofia.id, type: 'deposit', amount: 28, description: 'Economizando para o kit de pintura', createdAt: daysAgo(15) },
    { accountId: savPedro.id, type: 'deposit', amount: 15, description: 'Primeira poupança! 🎉', createdAt: daysAgo(20) },
  ]});

  // ─── SPECIAL GOALS ─────────────────────────────────────────────────────────
  const deadline = new Date(); deadline.setDate(deadline.getDate() + 30);
  await prisma.specialGoal.create({ data: { childId: lucas.id, title: 'Semana perfeita de estudos 📐', bonusPoints: 50, targetPoints: 100, deadline, status: 'active', createdBy: carlos.id } });
  await prisma.specialGoal.create({ data: { childId: sofia.id, title: 'Mês sem reclamar de tarefa 🌟', bonusPoints: 80, targetPoints: 150, status: 'active', createdBy: carlos.id } });

  // ─── BADGES ────────────────────────────────────────────────────────────────
  const [b1, b2, b3] = await Promise.all([
    prisma.badge.create({ data: { name: 'Primeiro passo', description: 'Completou a primeira tarefa!', icon: '🌱', conditionType: 'tasks_completed', conditionValue: 1 } }),
    prisma.badge.create({ data: { name: 'Dedicado', description: 'Completou 10 tarefas!', icon: '⭐', conditionType: 'tasks_completed', conditionValue: 10 } }),
    prisma.badge.create({ data: { name: 'Campeão', description: 'Completou 50 tarefas!', icon: '🏆', conditionType: 'tasks_completed', conditionValue: 50 } }),
  ]);

  await prisma.childBadge.createMany({ data: [
    { childId: lucas.id, badgeId: b1.id, earnedAt: daysAgo(60) },
    { childId: lucas.id, badgeId: b2.id, earnedAt: daysAgo(30) },
    { childId: lucas.id, badgeId: b3.id, earnedAt: daysAgo(10) },
    { childId: sofia.id, badgeId: b1.id, earnedAt: daysAgo(45) },
    { childId: sofia.id, badgeId: b2.id, earnedAt: daysAgo(15) },
    { childId: pedro.id, badgeId: b1.id, earnedAt: daysAgo(20) },
  ]});

  console.log('');
  console.log('✅ Dados de demonstração inseridos com sucesso!');
  console.log('');
  console.log('📧 Login de acesso:');
  console.log('   Email:  carlos@demo.com');
  console.log('   Senha:  Demo@2026');
  console.log('');
  console.log('👨‍👩‍👧‍👦 Família Oliveira criada com:');
  console.log('   3 filhos: Lucas 🦁  Sofia 🦋  Pedro 🚀');
  console.log('   8 tarefas configuradas');
  console.log('   5 itens na loja');
  console.log('   Poupança e carteira com histórico');
}

main().catch(console.error).finally(() => prisma.$disconnect());

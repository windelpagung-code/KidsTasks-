import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ─────────────────────────────────────────────────────────────
   Artigos do Blog KidsTasks
   Cada artigo é totalmente legível, otimizado para SEO e pensado
   para ranquear bem em buscas de pais brasileiros.
───────────────────────────────────────────────────────────── */

type Article = {
  slug: string;
  tag: string;
  emoji: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
};

const articles: Article[] = [
  /* ══════════════════════════════════════════════════════════
     ARTIGO 1 — Educação financeira infantil
  ══════════════════════════════════════════════════════════ */
  {
    slug: "como-ensinar-valor-do-dinheiro",
    tag: "Educação financeira",
    emoji: "💰",
    title: "Como ensinar o valor do dinheiro para crianças de 6 a 12 anos",
    description: "Crianças que aprendem sobre dinheiro cedo desenvolvem hábitos financeiros mais saudáveis na vida adulta. Veja como tornar esse aprendizado divertido e eficaz.",
    date: "10 de abril de 2025",
    readTime: "8 min",
    content: (
      <>
        <p>
          Você já observou seu filho pedir um brinquedo caro sem a menor noção de quanto custa? Ou gastar toda a mesada em minutos e já querer mais? Essa falta de referência financeira é completamente normal — e completamente reversível, quando os pais agem cedo.
        </p>
        <p>
          Pesquisas mostram que os hábitos financeiros de uma pessoa são formados ainda na infância. Um estudo da Universidade de Cambridge revelou que os padrões de comportamento com dinheiro já estão estabelecidos aos 7 anos de idade. Isso significa que o que você ensina hoje terá impacto direto na vida financeira do seu filho adulto.
        </p>
        <p>
          A boa notícia: ensinar educação financeira não precisa ser chato, técnico ou complicado. Com as estratégias certas para cada faixa etária, o aprendizado acontece de forma natural — e até divertida.
        </p>

        <h2>Por que começar cedo faz diferença?</h2>
        <p>
          A infância é o período de maior plasticidade cerebral. É quando hábitos, crenças e comportamentos se consolidam com mais facilidade. Uma criança que aprende a poupar, planejar e tomar decisões financeiras conscientemente carrega esses padrões para a vida adulta.
        </p>
        <p>
          Além disso, ensinar sobre dinheiro na prática — e não apenas na teoria — cria conexões muito mais duradouras no cérebro. Quando a criança vivencia a experiência de juntar dinheiro para comprar algo que deseja, o aprendizado é muito mais efetivo do que qualquer palestra ou sermão.
        </p>

        <h2>6 a 8 anos: o primeiro contato com o conceito</h2>
        <p>
          Nessa fase, o objetivo não é ensinar finanças complexas — é criar familiaridade com o conceito de dinheiro, troca e valor.
        </p>
        <h3>O que fazer:</h3>
        <ul>
          <li><strong>Deixe-os manusear dinheiro físico.</strong> Dar moedas e notas reais cria uma conexão tangível que o dinheiro digital não consegue replicar nessa idade.</li>
          <li><strong>Use o cofrinho de três divisões.</strong> Um cofrinho dividido em "gastar", "guardar" e "dar" ensina desde cedo os três pilares da saúde financeira.</li>
          <li><strong>Leve-os ao supermercado.</strong> Deixe que olhem os preços, comparem produtos e entendam que cada coisa tem um custo.</li>
          <li><strong>Jogue com dinheiro de mentirinha.</strong> Jogos como banco imobiliário e mercadinho são ferramentas poderosas de aprendizado lúdico.</li>
        </ul>
        <p>
          O que <em>não</em> fazer: não diga simplesmente "não temos dinheiro para isso". Prefira "esse produto não está no nosso plano hoje — mas podemos pensar em como juntar para ele". Isso ensina planejamento, não privação.
        </p>

        <h2>9 a 10 anos: entendendo ganho e gasto</h2>
        <p>
          Com 9 e 10 anos, as crianças já conseguem compreender relações de causa e efeito mais complexas. É o momento ideal para introduzir a mesada vinculada a responsabilidades.
        </p>
        <h3>O que fazer:</h3>
        <ul>
          <li><strong>Implemente uma mesada estruturada.</strong> Vincule parte da mesada à realização de tarefas domésticas. Isso ensina que dinheiro é resultado de trabalho.</li>
          <li><strong>Ensine a diferença entre querer e precisar.</strong> Antes de comprar algo, pergunte: "Você precisa ou quer isso?" É simples, mas muda a perspectiva.</li>
          <li><strong>Abra uma conta poupança.</strong> Muitos bancos têm contas infantis. Ver o saldo crescer mês a mês é motivador e tangível.</li>
          <li><strong>Deixe-os errar (dentro de limites).</strong> Se quiser gastar toda a mesada em balas e depois não ter dinheiro para o adesivo que queria, deixe. O aprendizado com a consequência real vale mais do que qualquer conversa.</li>
        </ul>

        <h2>11 a 12 anos: planejamento e metas</h2>
        <p>
          A pré-adolescência é o momento de introduzir conceitos mais sofisticados: metas, planejamento de médio prazo e até noções básicas de investimento.
        </p>
        <h3>O que fazer:</h3>
        <ul>
          <li><strong>Defina metas juntos.</strong> "Você quer aquele videogame novo? Vamos calcular quantas semanas de mesada são necessárias." Isso ensina planejamento real.</li>
          <li><strong>Mostre a conta de casa.</strong> Não precisa entrar em detalhes, mas mostrar que a casa tem custos mensais (luz, água, internet, mercado) contextualiza o valor do dinheiro.</li>
          <li><strong>Explique o que são juros — de forma simples.</strong> "Se você comprar parcelado, vai pagar mais do que o preço original. Prefere juntar e pagar à vista?" É uma lição que muitos adultos ainda não aprenderam.</li>
          <li><strong>Fale sobre doação.</strong> Separar uma parte pequena da mesada para ajudar alguém ou uma causa desenvolve empatia e senso de comunidade.</li>
        </ul>

        <h2>Os erros mais comuns dos pais</h2>
        <p>
          Mesmo com boas intenções, alguns comportamentos comuns dos pais sabotam a educação financeira dos filhos:
        </p>
        <ul>
          <li><strong>Dar dinheiro sem critério.</strong> Quando a criança recebe dinheiro sem relação com responsabilidade ou esforço, aprende que dinheiro "aparece" magicamente.</li>
          <li><strong>Resolver tudo na hora.</strong> Se sempre que a criança quer algo você compra imediatamente, ela não aprende a esperar, planejar ou valorizar.</li>
          <li><strong>Fazer do dinheiro um tabu.</strong> Famílias que nunca falam de dinheiro criam adultos financeiramente analfabetos. Normalizar o tema em casa é essencial.</li>
          <li><strong>Recompensar tudo em dinheiro.</strong> Nem tudo precisa ser remunerado. Algumas responsabilidades fazem parte de ser membro da família — e isso também é uma lição importante.</li>
        </ul>

        <h2>Como o KidsTasks ajuda nesse processo</h2>
        <p>
          O KidsTasks foi criado exatamente para tornar esse processo mais fácil, consistente e divertido. Com a plataforma, seus filhos recebem pontos por completar tarefas, acompanham o saldo da carteira virtual em tempo real, definem metas de poupança e podem "comprar" recompensas na loja familiar.
        </p>
        <p>
          Tudo isso acontece dentro de um ambiente gamificado — o que aumenta o engajamento e a motivação das crianças de forma natural. E você, como pai ou mãe, acompanha tudo pelo painel administrativo, aprovando tarefas e gerenciando as recompensas.
        </p>
        <p>
          O resultado é uma rotina onde educação financeira acontece todos os dias, de forma prática, sem precisar de aulas ou sermões.
        </p>

        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6 my-8">
          <p className="font-bold text-violet-900 mb-2">💡 Dica prática para hoje</p>
          <p className="text-violet-700 text-sm">Sente com seu filho nesse fim de semana e pergunte: "O que você gostaria de ter ou fazer que custa dinheiro?" Defina juntos um valor e um prazo realista. Esse simples exercício já é o primeiro passo para uma mente financeiramente saudável.</p>
        </div>

        <h2>Conclusão</h2>
        <p>
          Ensinar o valor do dinheiro para crianças não é uma conversa única — é uma prática diária, construída com paciência, exemplos e consistência. Comece pequeno, adapte para a idade do seu filho e, acima de tudo, mostre na prática como você mesmo lida com o dinheiro.
        </p>
        <p>
          Lembre-se: você não precisa ser especialista em finanças para criar um filho financeiramente inteligente. Você só precisa estar disposto a conversar sobre o assunto — e agir de forma coerente com o que ensina.
        </p>
      </>
    ),
  },

  /* ══════════════════════════════════════════════════════════
     ARTIGO 2 — Tarefas por faixa etária
  ══════════════════════════════════════════════════════════ */
  {
    slug: "tarefas-domesticas-por-idade",
    tag: "Rotina familiar",
    emoji: "🏠",
    title: "Tarefas domésticas por faixa etária: o guia completo para pais",
    description: "Saber quais tarefas são adequadas para cada idade é essencial. Confira o guia completo com responsabilidades por faixa etária e dicas para implementar sem conflitos.",
    date: "02 de abril de 2025",
    readTime: "7 min",
    content: (
      <>
        <p>
          Uma das perguntas mais comuns entre pais é: "Meu filho tem idade para fazer isso?" Atribuir tarefas inadequadas — muito difíceis ou muito fáceis — pode frustrar a criança e gerar mais resistência do que cooperação.
        </p>
        <p>
          A boa notícia é que existe uma orientação clara sobre quais responsabilidades são adequadas para cada fase do desenvolvimento. E quando as tarefas são ajustadas à capacidade real da criança, a adesão é muito maior.
        </p>
        <p>
          Neste artigo, você vai encontrar um guia completo por faixa etária — com tarefas práticas, dicas de implementação e os benefícios que cada responsabilidade traz para o desenvolvimento da criança.
        </p>

        <h2>Por que tarefas domésticas são importantes?</h2>
        <p>
          Antes de entrar nas listas, vale entender o porquê. Pesquisas da Universidade de Minnesota acompanharam crianças desde os 3 anos e descobriram que aquelas que faziam tarefas domésticas regularmente eram mais bem-sucedidas na vida adulta — em termos de relacionamentos, carreira e bem-estar emocional.
        </p>
        <p>Participar da rotina doméstica ensina às crianças:</p>
        <ul>
          <li><strong>Responsabilidade:</strong> entender que suas ações têm consequências para o grupo.</li>
          <li><strong>Autonomia:</strong> a capacidade de fazer coisas por conta própria.</li>
          <li><strong>Trabalho em equipe:</strong> que a família funciona como uma unidade coletiva.</li>
          <li><strong>Autoestima:</strong> a sensação de "eu consigo" é poderosa para o desenvolvimento emocional.</li>
          <li><strong>Organização:</strong> hábitos de ordem que serão úteis por toda a vida.</li>
        </ul>

        <h2>3 a 5 anos: pequenos ajudantes</h2>
        <p>
          Crianças dessa fase adoram imitar adultos e se sentem especiais quando "ajudam de verdade". Aproveite essa disposição natural — ela não dura para sempre!
        </p>
        <h3>Tarefas adequadas:</h3>
        <ul>
          <li>Guardar os brinquedos no lugar após brincar</li>
          <li>Colocar roupas sujas no cesto</li>
          <li>Ajudar a alimentar os pets</li>
          <li>Ajudar a regar plantas (com orientação)</li>
          <li>Dobrar panos simples (como panos de prato)</li>
          <li>Colocar e retirar os talheres da mesa (os não cortantes)</li>
          <li>Limpar derrames simples com pano</li>
        </ul>
        <p><strong>Dica:</strong> Faça junto com eles! Nessa fase, a tarefa é mais um momento de conexão do que de eficiência. Não exija perfeição — o processo importa mais do que o resultado.</p>

        <h2>6 a 8 anos: desenvolvendo consistência</h2>
        <p>
          Com a entrada na escola, a criança já tem capacidade de seguir rotinas e entender a ideia de responsabilidade recorrente. É hora de tarefas fixas — as mesmas, toda semana.
        </p>
        <h3>Tarefas adequadas:</h3>
        <ul>
          <li>Arrumar a própria cama todos os dias</li>
          <li>Organizar a mochila escolar</li>
          <li>Limpar a mesa após as refeições</li>
          <li>Varrer um cômodo pequeno</li>
          <li>Lavar louças leves (copos, pratos plásticos)</li>
          <li>Separar o lixo reciclável</li>
          <li>Trocar a areia do gato (com supervisão)</li>
          <li>Ajudar a dobrar roupas separadas por categoria</li>
        </ul>
        <p><strong>Dica:</strong> Crie um checklist visual na porta do quarto ou geladeira. Crianças dessa faixa amam riscar tarefas concluídas — é uma recompensa por si só.</p>

        <h2>9 a 11 anos: mais autonomia, mais responsabilidade</h2>
        <p>
          Nessa fase, a criança já tem coordenação motora e capacidade cognitiva para tarefas mais complexas. É o momento de aumentar o nível e começar a vincular responsabilidades à mesada.
        </p>
        <h3>Tarefas adequadas:</h3>
        <ul>
          <li>Lavar e guardar a louça completa</li>
          <li>Passar aspirador de pó nos cômodos</li>
          <li>Lavar o banheiro (com produtos adequados e orientação)</li>
          <li>Preparar lanches e refeições simples</li>
          <li>Lavar e estender roupas simples</li>
          <li>Cuidar de irmãos menores por curtos períodos (com adulto por perto)</li>
          <li>Fazer compras simples no mercado próximo</li>
          <li>Regar o jardim e cuidar de plantas</li>
        </ul>
        <p><strong>Dica:</strong> Dê autonomia para escolher <em>quando</em> a tarefa será feita — não apenas <em>qual</em>. "A cama precisa estar arrumada antes do jantar" dá liberdade e ensina gerenciamento de tempo.</p>

        <h2>12 anos em diante: parceiros domésticos</h2>
        <p>
          Adolescentes são capazes de assumir responsabilidades quase equivalentes às dos adultos. Trate-os como parceiros, não como subordinados — e os resultados serão muito melhores.
        </p>
        <h3>Tarefas adequadas:</h3>
        <ul>
          <li>Planejar e preparar uma refeição completa por semana</li>
          <li>Fazer a lista de compras e ir ao supermercado</li>
          <li>Cuidar da própria roupa (lavar, dobrar e guardar)</li>
          <li>Limpar a cozinha inteira após cozinhar</li>
          <li>Cuidar dos irmãos menores por algumas horas</li>
          <li>Serviços externos simples (lavar o carro, limpar a garagem)</li>
          <li>Gerenciar o próprio orçamento mensal de mesada</li>
        </ul>
        <p><strong>Dica:</strong> Negocie as tarefas, não imponha. Adolescentes respondem muito melhor quando sentem que têm voz. "Quais dessas responsabilidades você quer assumir este mês?" funciona melhor do que uma lista pronta.</p>

        <h2>Como implementar sem conflitos</h2>
        <p>
          Mesmo com as tarefas certas para a idade, a resistência pode aparecer. Veja como minimizar os conflitos:
        </p>
        <ul>
          <li><strong>Apresente como parte de ser família, não como punição.</strong> "Na nossa família, todos ajudam" é bem diferente de "você vai fazer isso porque sou seu pai/mãe".</li>
          <li><strong>Seja consistente.</strong> Nada mina mais o sistema de tarefas do que a inconsistência dos pais. Se a tarefa não foi feita, é preciso haver consequência — sempre.</li>
          <li><strong>Reconheça o esforço.</strong> Mesmo quando o resultado não é perfeito, reconhecer o esforço da criança é essencial para manter a motivação.</li>
          <li><strong>Não refaça a tarefa na frente deles.</strong> Se refizer imediatamente porque ficou "mal feito", você comunica que o esforço foi inútil. Corrija com gentileza e ensinamento.</li>
          <li><strong>Use sistemas de acompanhamento.</strong> Plataformas como o KidsTasks tornam as tarefas visíveis, gamificadas e recompensadas — o que aumenta muito a adesão.</li>
        </ul>

        <h2>A diferença entre tarefas com e sem remuneração</h2>
        <p>
          Uma dúvida comum entre pais é: devo pagar por todas as tarefas? A resposta é não. Existem dois tipos:
        </p>
        <ul>
          <li><strong>Tarefas de família (sem remuneração):</strong> arrumar a cama, deixar o quarto organizado, colocar o prato na pia. São responsabilidades básicas de ser membro da casa.</li>
          <li><strong>Tarefas extras (com remuneração):</strong> lavar o carro, limpar o banheiro completo, fazer uma refeição. São esforços acima do básico, que merecem reconhecimento financeiro.</li>
        </ul>
        <p>
          Misturar os dois tipos cria a percepção de que toda ajuda deve ser paga — o que não é o objetivo.
        </p>

        <h2>Conclusão</h2>
        <p>
          Atribuir tarefas adequadas à faixa etária do seu filho é o passo mais importante para criar uma rotina doméstica harmoniosa. Comece com o que a criança já consegue fazer, aumente gradualmente e mantenha a consistência.
        </p>
        <p>
          O objetivo não é ter uma casa perfeitamente limpa — é criar adultos capazes, responsáveis e conscientes de que fazem parte de uma comunidade que cuida uns dos outros.
        </p>
      </>
    ),
  },

  /* ══════════════════════════════════════════════════════════
     ARTIGO 3 — Gamificação vs Punição
  ══════════════════════════════════════════════════════════ */
  {
    slug: "gamificacao-vs-punicao",
    tag: "Gamificação",
    emoji: "🎮",
    title: "Por que a gamificação funciona melhor do que punição na educação dos filhos",
    description: "A ciência comprova: recompensas positivas são mais eficazes do que castigos. Entenda como a gamificação transforma a relação dos filhos com responsabilidades.",
    date: "25 de março de 2025",
    readTime: "9 min",
    content: (
      <>
        <p>
          "Se você não arrumar o quarto, vai ficar de castigo." Quantas vezes você já disse ou ouviu essa frase? E quantas vezes funcionou de verdade — não apenas naquele dia, mas criando um hábito duradouro?
        </p>
        <p>
          A punição é o recurso mais usado pelos pais brasileiros — e um dos menos eficazes para criar comportamentos positivos sustentáveis. A neurociência e a psicologia comportamental são claras sobre isso. E é exatamente aqui que a gamificação entra como uma alternativa poderosa.
        </p>

        <h2>O que diz a ciência sobre punição</h2>
        <p>
          Punições ativam o sistema de ameaça do cérebro — a amígdala. Quando a criança está com medo do castigo, o córtex pré-frontal (responsável pelo raciocínio, planejamento e aprendizado) fica em segundo plano. Isso significa que a criança pode <em>obedecer</em> no curto prazo, mas não está <em>aprendendo</em> no longo prazo.
        </p>
        <p>
          Estudos da American Psychological Association mostram que:
        </p>
        <ul>
          <li>Punições físicas e verbais severas aumentam a agressividade e a ansiedade nas crianças.</li>
          <li>Crianças punidas frequentemente focam em <em>não ser pego</em> em vez de <em>fazer a coisa certa</em>.</li>
          <li>O comportamento punido tende a retornar quando a ameaça de punição desaparece.</li>
          <li>A relação pai-filho se deteriora quando a punição é a principal ferramenta de disciplina.</li>
        </ul>
        <p>
          Isso não significa que limites e consequências não sejam necessários — são. Mas existe uma diferença enorme entre consequências naturais e lógicas e punições arbitrárias por raiva ou frustração.
        </p>

        <h2>O que é gamificação — e por que funciona</h2>
        <p>
          Gamificação é a aplicação de elementos dos jogos em contextos não relacionados a jogos. Pontos, níveis, conquistas, missões, recompensas — tudo isso cria um ambiente de motivação intrínseca poderoso.
        </p>
        <p>
          Quando uma criança joga um videogame, ela enfrenta desafios progressivamente mais difíceis, recebe feedback imediato sobre seu progresso e é recompensada por cada conquista. Isso mantém o cérebro engajado e motivado por horas.
        </p>
        <p>
          A gamificação na educação familiar usa exatamente esses mesmos princípios para criar motivação em torno de responsabilidades domésticas, tarefas escolares e hábitos saudáveis.
        </p>
        <h3>Por que o cérebro responde tão bem à gamificação:</h3>
        <ul>
          <li><strong>Dopamina:</strong> cada conquista libera dopamina, o neurotransmissor do prazer e da motivação. O cérebro quer repetir o comportamento que gerou a recompensa.</li>
          <li><strong>Progresso visível:</strong> ver o avanço em tempo real (pontos, barras de progresso, níveis) mantém o engajamento. Tarefas sem feedback parecem sem sentido.</li>
          <li><strong>Autonomia:</strong> sistemas de gamificação bem desenhados dão à criança controle sobre suas escolhas — o que aumenta a motivação interna.</li>
          <li><strong>Feedback imediato:</strong> crianças precisam de retorno rápido sobre suas ações. Na gamificação, o feedback é instantâneo — diferente da punição que pode vir horas depois.</li>
        </ul>

        <h2>Gamificação vs Punição: uma comparação direta</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-violet-50">
                <th className="text-left p-3 border border-violet-100 font-bold text-violet-900">Aspecto</th>
                <th className="text-left p-3 border border-violet-100 font-bold text-red-700">Punição</th>
                <th className="text-left p-3 border border-violet-100 font-bold text-emerald-700">Gamificação</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Motivação", "Medo de consequência negativa", "Desejo de conquista positiva"],
                ["Duração do efeito", "Curto prazo (enquanto há ameaça)", "Longo prazo (hábito formado)"],
                ["Impacto emocional", "Ansiedade, medo, ressentimento", "Satisfação, orgulho, alegria"],
                ["Aprendizado", "Baixo (fuga, não internalização)", "Alto (associação positiva)"],
                ["Relação pai-filho", "Pode deteriorar com o tempo", "Fortalece com conquistas compartilhadas"],
                ["Criatividade", "Bloqueia (modo de ameaça ativo)", "Estimula (ambiente seguro)"],
              ].map(([asp, pun, gam]) => (
                <tr key={asp} className="even:bg-gray-50">
                  <td className="p-3 border border-gray-100 font-medium text-gray-900">{asp}</td>
                  <td className="p-3 border border-gray-100 text-gray-600">{pun}</td>
                  <td className="p-3 border border-gray-100 text-gray-600">{gam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Como implementar gamificação em casa — na prática</h2>
        <p>Você não precisa de uma plataforma para começar. Veja como aplicar os princípios básicos hoje mesmo:</p>

        <h3>1. Crie um sistema de pontos</h3>
        <p>
          Atribua pontos a cada tarefa ou responsabilidade. Arrumar a cama: 10 pontos. Completar o dever de casa sem lembretes: 15 pontos. Ajudar um irmão: 20 pontos. Acumule pontos semanais que podem ser trocados por recompensas.
        </p>

        <h3>2. Defina recompensas desejadas pela criança</h3>
        <p>
          As recompensas precisam ser atrativas para <em>ela</em> — não para você. Uma hora extra de tela, escolher o jantar de sexta, um passeio especial. Envolva a criança na definição das recompensas para aumentar o engajamento.
        </p>

        <h3>3. Torne o progresso visível</h3>
        <p>
          Um painel na parede, um app, uma planilha colorida — o formato não importa. O que importa é que a criança possa ver o quanto já conquistou e quanto falta para a próxima recompensa.
        </p>

        <h3>4. Celebre conquistas — grandes e pequenas</h3>
        <p>
          Um "muito bem!" entusiasmado, um high five, uma nota na lancheira. Reconhecimento verbal e físico reforça o comportamento desejado tanto quanto a recompensa material.
        </p>

        <h3>5. Crie desafios progressivos</h3>
        <p>
          Comece com tarefas fáceis para gerar as primeiras conquistas e construir confiança. Aumente gradualmente a complexidade. A sensação de progresso é essencial para manter o engajamento no longo prazo.
        </p>

        <h2>O papel do KidsTasks nesse processo</h2>
        <p>
          O KidsTasks foi projetado especificamente para aplicar princípios de gamificação na rotina familiar. Na plataforma, cada tarefa concluída gera XP (pontos de experiência), sobe de nível e alimenta a carteira virtual do filho — que pode ser usada na loja de recompensas que você mesmo configura.
        </p>
        <p>
          O dashboard mostra o progresso em tempo real, os pais aprovam as tarefas concluídas antes de liberar os pontos, e toda a família acompanha o desenvolvimento de cada criança. É gamificação séria, implementada de forma simples e divertida.
        </p>

        <h2>Punição tem lugar?</h2>
        <p>
          Sim — mas não como ferramenta principal e jamais como reação emocional. Consequências naturais e lógicas têm valor educativo. Se a criança não arrumou o quarto e não pode receber amigos, isso é uma consequência que faz sentido. Se perdeu pontos por não completar uma tarefa, isso é consequência dentro do sistema.
        </p>
        <p>
          A diferença está na intencionalidade: consequências ensinam. Punições por raiva apenas machucam.
        </p>

        <h2>Conclusão</h2>
        <p>
          Criar filhos responsáveis não exige rigidez ou medo. Exige consistência, criatividade e um sistema que torna visível e recompensa o esforço diário da criança.
        </p>
        <p>
          A gamificação não é uma forma de "comprar" o comportamento dos filhos — é uma forma de tornar o aprendizado de responsabilidades genuinamente motivador. E quando a criança age por motivação genuína, o hábito se forma para a vida.
        </p>
      </>
    ),
  },

  /* ══════════════════════════════════════════════════════════
     ARTIGO 4 — Mesada
  ══════════════════════════════════════════════════════════ */
  {
    slug: "mesada-quanto-dar-e-como-estruturar",
    tag: "Mesada",
    emoji: "🪙",
    title: "Mesada para filhos: quanto dar, como estruturar e o que evitar",
    description: "Não existe um valor certo — mas existe uma estrutura certa. Descubra como organizar a mesada do seu filho de forma que ela realmente ensine o valor do dinheiro.",
    date: "18 de março de 2025",
    readTime: "8 min",
    content: (
      <>
        <p>
          Mesada é um tema que divide opiniões. Alguns pais acreditam que deve ser incondicional. Outros, que precisa ser totalmente atrelada a tarefas. Há quem ache que é mimação, e quem veja como ferramenta educacional indispensável.
        </p>
        <p>
          A verdade, como quase sempre em educação, está no equilíbrio — e no que você faz com a mesada, não apenas no quanto dá.
        </p>

        <h2>Por que dar mesada?</h2>
        <p>
          A mesada não é sobre dar dinheiro ao seu filho. É sobre criar um laboratório seguro onde ele aprende a tomar decisões financeiras — com consequências reais, mas em escala controlada.
        </p>
        <p>Crianças que recebem e gerenciam mesada desde cedo:</p>
        <ul>
          <li>Desenvolvem hábitos de planejamento e controle de gastos.</li>
          <li>Aprendem que dinheiro é finito — e que decisões têm consequências.</li>
          <li>Ficam menos propensas a ceder a impulsos de consumo na vida adulta.</li>
          <li>Desenvolvem senso de autonomia e autoconfiança financeira.</li>
        </ul>

        <h2>Quanto dar? Uma referência prática</h2>
        <p>
          Não existe uma regra universal, mas uma referência usada por muitos especialistas é <strong>R$ 1 a R$ 2 por semana para cada ano de idade</strong>. Ou seja:
        </p>
        <ul>
          <li>Criança de 6 anos → R$ 6 a R$ 12 por semana</li>
          <li>Criança de 8 anos → R$ 8 a R$ 16 por semana</li>
          <li>Criança de 10 anos → R$ 10 a R$ 20 por semana</li>
          <li>Adolescente de 13 anos → R$ 13 a R$ 26 por semana</li>
        </ul>
        <p>
          Ajuste conforme a realidade financeira da família e o que a mesada deve cobrir. Uma mesada que precisa pagar lanches escolares é diferente de uma que serve apenas para gastos livres.
        </p>
        <p>
          O importante é que o valor seja suficiente para criar escolhas reais — nem tão alto que a criança possa ter tudo sem planejar, nem tão baixo que não haja nada significativo para decidir.
        </p>

        <h2>Três modelos de mesada — e qual escolher</h2>

        <h3>Modelo 1: Mesada Incondicional</h3>
        <p>
          A criança recebe um valor fixo, independentemente de tarefas ou comportamento. A lógica é que dinheiro e responsabilidade são aprendizados separados — e misturar os dois pode criar filhos que só ajudam em casa quando há recompensa financeira.
        </p>
        <p><strong>Funciona bem para:</strong> pais que querem ensinar gestão financeira sem vincular dinheiro a comportamento.</p>
        <p><strong>Risco:</strong> a criança pode não conectar esforço com recompensa.</p>

        <h3>Modelo 2: Mesada por Tarefas</h3>
        <p>
          A criança ganha de acordo com as tarefas que completa. Cada tarefa tem um valor definido. No final da semana ou mês, o saldo é o resultado do esforço.
        </p>
        <p><strong>Funciona bem para:</strong> ensinar a relação entre trabalho e remuneração.</p>
        <p><strong>Risco:</strong> a criança pode se recusar a ajudar quando não precisa de dinheiro, ou transformar toda colaboração em negociação.</p>

        <h3>Modelo 3: Mesada Híbrida (recomendado)</h3>
        <p>
          Um valor base fixo para responsabilidades essenciais (parte da identidade de ser membro da família), mais valores adicionais para tarefas extras e esforços acima do básico.
        </p>
        <p><strong>Funciona bem porque:</strong> diferencia colaboração básica (sem pagamento) de esforço adicional (com recompensa), criando uma visão mais realista do mundo do trabalho.</p>

        <h2>A regra dos três cofrinhos</h2>
        <p>
          Independentemente do modelo escolhido, a distribuição da mesada é tão importante quanto o valor. A regra dos três cofrinhos é uma das ferramentas mais eficazes:
        </p>
        <ul>
          <li><strong>Gastar (50%):</strong> para despesas do dia a dia e pequenos desejos imediatos.</li>
          <li><strong>Poupar (40%):</strong> para uma meta de médio prazo — um brinquedo maior, um jogo, uma experiência.</li>
          <li><strong>Dar (10%):</strong> para doação, ajuda a alguém ou uma causa escolhida pela criança.</li>
        </ul>
        <p>
          As proporções podem variar, mas manter as três categorias é fundamental para criar uma visão equilibrada do uso do dinheiro.
        </p>

        <h2>Como definir as regras da mesada</h2>
        <p>Antes de começar, defina claramente:</p>
        <ul>
          <li><strong>Frequência:</strong> semanal funciona melhor para crianças menores (menor horizonte de tempo); mensal para adolescentes.</li>
          <li><strong>O que a mesada cobre:</strong> lanches? Brinquedos? Presentes para amigos? Deixe claro o que é responsabilidade da mesada e o que os pais ainda custeiam.</li>
          <li><strong>O que acontece quando acaba:</strong> se a criança gastar tudo na segunda-feira, não há adiantamento. Essa é a lição mais importante.</li>
          <li><strong>Como pedir ajustes:</strong> com o passar do tempo e aumento de responsabilidades, o valor deve ser renegociado — mas com argumentos.</li>
        </ul>

        <h2>Erros comuns que sabotam a mesada</h2>
        <ul>
          <li><strong>Dar adiantamentos com frequência.</strong> Isso ensina que consequências não são reais e que sempre há um "socorro" disponível.</li>
          <li><strong>Usar a mesada como punição.</strong> Retirar a mesada por mau comportamento mistura educação financeira com disciplina — e confunde as duas mensagens.</li>
          <li><strong>Não deixar a criança decidir.</strong> Se você sempre interfere nas decisões de compra, a criança não aprende a decidir. Deixe-a comprar a besteira e experienciar a consequência.</li>
          <li><strong>Ser inconsistente.</strong> Mesada que chega quando lembra é mesada que não ensina nada. A consistência é o ingrediente mais importante.</li>
        </ul>

        <h2>Mesada virtual no KidsTasks</h2>
        <p>
          O KidsTasks traz um sistema completo de carteira virtual que funciona como uma mesada gamificada. Os filhos acumulam pontos ao completar tarefas, acompanham o saldo em tempo real, definem metas de poupança e usam os pontos na loja de recompensas configurada pelos pais.
        </p>
        <p>
          Isso cria toda a experiência de gestão financeira de forma segura, digital e muito mais engajante do que o dinheiro físico — especialmente para a geração que cresceu com smartphones.
        </p>

        <h2>Conclusão</h2>
        <p>
          Não existe valor certo de mesada. Existe consistência, clareza de regras e espaço para que a criança tome decisões e aprenda com elas. Comece hoje, mesmo que pequeno, e construa o hábito gradualmente.
        </p>
        <p>
          A mesada mais eficaz não é a maior — é a que vem acompanhada de conversa, intenção e espaço para errar e aprender.
        </p>
      </>
    ),
  },

  /* ══════════════════════════════════════════════════════════
     ARTIGO 5 — Responsabilidade infantil
  ══════════════════════════════════════════════════════════ */
  {
    slug: "responsabilidade-infantil-sem-pressao",
    tag: "Desenvolvimento",
    emoji: "🌱",
    title: "Responsabilidade infantil: como desenvolver sem pressão nem conflitos",
    description: "Criar filhos responsáveis exige equilíbrio entre autonomia e limites. Confira estratégias práticas que funcionam na rotina de famílias reais.",
    date: "10 de março de 2025",
    readTime: "7 min",
    content: (
      <>
        <p>
          Todo pai quer criar um filho responsável. Mas entre a intenção e a prática, surgem os conflitos: a criança que "esquece" as tarefas, o adolescente que nega qualquer responsabilidade, o ciclo interminável de cobranças e resistências.
        </p>
        <p>
          A responsabilidade não é um traço de personalidade com o qual as pessoas nascem — é uma habilidade que se desenvolve, ao longo do tempo, com as condições certas. E criar essas condições é papel dos pais.
        </p>

        <h2>O que é responsabilidade, de verdade?</h2>
        <p>
          Responsabilidade é a capacidade de reconhecer que nossas ações têm consequências — para nós mesmos e para os outros — e de agir com base nessa consciência, mesmo sem supervisão direta.
        </p>
        <p>
          Uma criança responsável não é aquela que obedece quando o pai está olhando. É aquela que arruma o quarto porque sabe que é importante, que cumpre um compromisso porque entende o impacto de não cumprir, que se levanta e tenta de novo quando comete um erro.
        </p>

        <h2>Por que a pressão não funciona</h2>
        <p>
          Quando pressionamos demais, a criança aprende a ser responsável apenas sob pressão — o que significa que, na ausência do pai ou da mãe, o comportamento desaparece. É o chamado <em>controle externo</em>: a motivação vem de fora, não de dentro.
        </p>
        <p>
          O objetivo da educação é justamente o oposto: desenvolver <em>controle interno</em> — a capacidade de agir corretamente por convicção própria, não por medo ou obrigação.
        </p>
        <p>
          Pressão excessiva também gera efeitos colaterais sérios:
        </p>
        <ul>
          <li>Ansiedade e medo do erro</li>
          <li>Passividade ("para que tentar se nunca está bom o suficiente?")</li>
          <li>Rebeldia e resistência deliberada</li>
          <li>Baixa autoestima e sensação de incompetência</li>
        </ul>

        <h2>Os pilares do desenvolvimento de responsabilidade</h2>

        <h3>1. Autonomia com limites</h3>
        <p>
          Responsabilidade só se desenvolve quando há espaço para tomar decisões. Uma criança que nunca decide nada não aprende a ser responsável — aprende a obedecer.
        </p>
        <p>
          Ofereça escolhas reais dentro de limites seguros: "Você quer arrumar o quarto antes ou depois do lanche?" Em vez de "Arrume o quarto agora." As duas chegam ao mesmo resultado, mas a primeira desenvolve autonomia.
        </p>

        <h3>2. Consequências naturais e lógicas</h3>
        <p>
          Deixe que as consequências naturais ensinem — quando seguro. Se a criança não preparou a mochila, vai para a escola sem o material. Se gastou toda a mesada no início da semana, vai ficar sem dinheiro até a próxima.
        </p>
        <p>
          Quando a consequência precisa ser construída (não natural), que ela seja lógica: se não arrumou o quarto, não pode receber amigos nele. A lógica faz sentido para a criança — a punição arbitrária, não.
        </p>

        <h3>3. Expectativas claras e realistas</h3>
        <p>
          A criança precisa saber exatamente o que é esperado dela — e o que acontece quando não cumpre. Regras vagas geram ansiedade e desentendimentos.
        </p>
        <p>
          "Mantenha o quarto organizado" é vago. "Antes de dormir, o chão deve estar livre de roupas e brinquedos" é claro. Seja específico.
        </p>

        <h3>4. Modelo parental consistente</h3>
        <p>
          Você é o maior exemplo de responsabilidade que seus filhos têm. Eles observam como você cumpre (ou não) seus compromissos, como lida com erros, como reage quando as coisas não saem como planejado.
        </p>
        <p>
          Admitir um erro na frente dos filhos — e mostrar como corrige — é uma das lições mais poderosas de responsabilidade que um pai pode dar.
        </p>

        <h3>5. Reconhecimento genuíno</h3>
        <p>
          Reconheça o esforço, não apenas o resultado. "Eu percebi que você arrumou o quarto antes de eu pedir — isso foi muito maduro da sua parte." Esse tipo de feedback específico é muito mais poderoso do que um genérico "bom filho".
        </p>

        <h2>Estratégias práticas para a rotina</h2>

        <h3>Rotina visual</h3>
        <p>
          Para crianças até 10 anos, uma rotina visual (com ícones ou fotos) na parede do quarto reduz drasticamente a necessidade de lembretes. A criança pode consultar por conta própria o que precisa fazer.
        </p>

        <h3>Check-in diário</h3>
        <p>
          Reserve 5 minutos antes de dormir para revisar o dia juntos: "O que você fez bem hoje? O que poderia ter sido diferente?" Esse hábito desenvolve autoconsciência — a raiz da responsabilidade.
        </p>

        <h3>Reuniões familiares</h3>
        <p>
          Uma reunião familiar semanal de 15 minutos para revisar tarefas, dar feedbacks e planejar a semana cria um senso de coletividade e responsabilidade compartilhada.
        </p>

        <h3>Gamificação da rotina</h3>
        <p>
          Sistemas de pontos, metas semanais e recompensas tornam a responsabilidade visível e motivante. O KidsTasks usa exatamente esse princípio: as crianças acumulam pontos ao completar tarefas e acompanham o progresso em tempo real — o que aumenta muito a adesão.
        </p>

        <h2>Quando o filho não quer colaborar</h2>
        <p>
          Resistência é normal e esperada — especialmente na adolescência. Antes de escalar o conflito, pergunte-se:
        </p>
        <ul>
          <li>A tarefa é adequada para a idade e capacidade?</li>
          <li>As regras foram combinadas juntos ou impostas?</li>
          <li>Houve reconhecimento recente pelo que foi feito bem?</li>
          <li>Existe alguma questão emocional ou de estresse envolvida?</li>
        </ul>
        <p>
          Muitas vezes, resistência a tarefas é sintoma de outra coisa: cansaço, pressão escolar, conflito com amigos. Antes de cobrar, pergunte como a criança está.
        </p>

        <h2>Conclusão</h2>
        <p>
          Desenvolver responsabilidade é um processo lento — e não linear. Haverá dias ótimos e dias difíceis. O que importa é a consistência da abordagem ao longo do tempo, não a perfeição de cada momento.
        </p>
        <p>
          Seja paciente com seus filhos — e consigo mesmo. Você também está aprendendo a ser o pai ou a mãe que eles precisam. Isso também é responsabilidade.
        </p>
      </>
    ),
  },

  /* ══════════════════════════════════════════════════════════
     ARTIGO 6 — Metas de poupança
  ══════════════════════════════════════════════════════════ */
  {
    slug: "metas-poupanca-para-criancas",
    tag: "Poupança",
    emoji: "🎯",
    title: "Metas de poupança para crianças: como tornar divertido e eficaz",
    description: "Quando a criança tem um objetivo claro, aprender a poupar se torna natural. Veja como definir metas motivadoras e acompanhar o progresso com seus filhos.",
    date: "03 de março de 2025",
    readTime: "6 min",
    content: (
      <>
        <p>
          "Eu quero aquele Lego!" "Eu quero o novo jogo!" "Eu quero ir ao parque aquático!"
        </p>
        <p>
          Toda criança tem desejos. E todo pai enfrenta a escolha: comprar imediatamente, negar ou usar o momento como oportunidade de aprendizado. A terceira opção — transformar o desejo em meta de poupança — é a mais trabalhosa no curto prazo e a mais poderosa no longo.
        </p>

        <h2>Por que metas funcionam melhor do que restrições</h2>
        <p>
          Quando dizemos apenas "não" para um pedido, a criança aprende que dinheiro é escasso e que ela não tem poder sobre a situação. Quando transformamos o pedido em meta, ela aprende que pode conquistar o que deseja com esforço e planejamento.
        </p>
        <p>
          Essa diferença de perspectiva é enorme. Um estudo da Stanford mostrou que crianças capazes de adiar gratificação em favor de recompensas maiores obtinham melhores resultados acadêmicos, profissionais e financeiros décadas depois. E metas de poupança são um treino direto para essa habilidade.
        </p>

        <h2>O que é uma boa meta de poupança para crianças</h2>
        <p>Uma meta eficaz precisa ser:</p>
        <ul>
          <li><strong>Específica:</strong> não "quero um brinquedo", mas "quero o Lego Star Wars modelo X que custa R$ 180".</li>
          <li><strong>Alcançável:</strong> deve ser possível conquistar com um esforço razoável — nem muito fácil (sem valor educativo) nem impossível (frustrante).</li>
          <li><strong>Com prazo:</strong> "vou juntar em 6 semanas" cria urgência e planejamento.</li>
          <li><strong>Desejada genuinamente pela criança:</strong> se a meta foi imposta pelos pais, a motivação será muito menor.</li>
        </ul>

        <h2>Como definir a meta juntos — passo a passo</h2>

        <h3>Passo 1: Deixe a criança escolher</h3>
        <p>
          Pergunte: "O que você mais quer conquistar agora?" Resista ao impulso de sugerir ou direcionar. A meta dela precisa ser <em>dela</em>.
        </p>

        <h3>Passo 2: Pesquisem o preço juntos</h3>
        <p>
          Vá ao site, à loja, ou ao catálogo. Deixe que a criança veja o preço real. Isso conecta o desejo abstrato a um número concreto.
        </p>

        <h3>Passo 3: Calculem quanto tempo vai levar</h3>
        <p>
          "Você recebe R$ 20 por semana de mesada e quer guardar R$ 10. Em quantas semanas vai ter os R$ 180?" Faça as contas juntos. Isso ensina matemática real com motivação real.
        </p>

        <h3>Passo 4: Crie um termômetro visual de progresso</h3>
        <p>
          Um termômetro desenhado no papel, um gráfico de barras na parede, ou uma ferramenta digital como o KidsTasks. O visual do progresso é poderoso para manter a motivação ao longo das semanas.
        </p>

        <h3>Passo 5: Celebre marcos intermediários</h3>
        <p>
          Alcançou 25% da meta? Celebre! Chegou na metade? Reconheça com entusiasmo. Não espere a meta final para dar feedback positivo — os marcos intermediários mantêm o engajamento.
        </p>

        <h2>Tipos de metas adequadas por faixa etária</h2>

        <h3>5 a 7 anos: metas de curto prazo (2 a 4 semanas)</h3>
        <ul>
          <li>Um brinquedo pequeno</li>
          <li>Uma ida ao cinema</li>
          <li>Um livro favorito</li>
          <li>Um pote de sorvete especial</li>
        </ul>
        <p>
          Nessa faixa, o conceito de "semanas" já é um horizonte longo. Metas que se concretizam em 2 a 4 semanas são ideais para manter a motivação.
        </p>

        <h3>8 a 10 anos: metas de médio prazo (1 a 3 meses)</h3>
        <ul>
          <li>Um jogo ou brinquedo maior</li>
          <li>Um passeio especial</li>
          <li>Um curso ou aula de algo que gosta</li>
          <li>Acessório para um hobby</li>
        </ul>

        <h3>11 anos em diante: metas mais ambiciosas (3 a 6 meses)</h3>
        <ul>
          <li>Um eletrônico desejado</li>
          <li>Uma viagem ou experiência</li>
          <li>Contribuição para algo maior (projeto, causa)</li>
          <li>Fundo de emergência próprio</li>
        </ul>

        <h2>O que fazer quando a criança desiste</h2>
        <p>
          Desistências são normais — especialmente nas primeiras tentativas. Quando isso acontece, não force nem puna. Use como oportunidade de conversa:
        </p>
        <ul>
          <li>"O que ficou difícil nessa meta?"</li>
          <li>"Você ainda quer isso tanto quanto antes?"</li>
          <li>"Poderíamos ajustar o prazo ou o valor que guarda por semana?"</li>
        </ul>
        <p>
          Às vezes a meta simplesmente perdeu o apelo — e tudo bem. Isso também é aprendizado: a criança descobre o que realmente valoriza quando precisa se esforçar para ter.
        </p>

        <h2>Metas de poupança no KidsTasks</h2>
        <p>
          O KidsTasks tem um módulo específico de poupança onde a criança define metas, acompanha o progresso com um gráfico visual em tempo real e vê claramente quanto falta para conquistar o que deseja.
        </p>
        <p>
          Os pais podem incentivar transferências extras para a poupança, visualizar o histórico e configurar recompensas na loja familiar ligadas diretamente às metas — criando um ciclo completo de motivação, esforço e conquista.
        </p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 my-8">
          <p className="font-bold text-emerald-900 mb-2">🎯 Desafio para esta semana</p>
          <p className="text-emerald-700 text-sm">Pergunte ao seu filho hoje: "Se você pudesse conquistar qualquer coisa guardando dinheiro, o que seria?" Escute sem julgar. Pesquisem o preço juntos. E começem a construir o plano. Esse simples exercício pode mudar a relação do seu filho com o dinheiro para sempre.</p>
        </div>

        <h2>Conclusão</h2>
        <p>
          Metas de poupança são uma das ferramentas mais eficazes da educação financeira infantil — porque unem desejo, planejamento, esforço e recompensa num ciclo que o cérebro adora. E o melhor: cada meta conquistada constrói confiança para a próxima.
        </p>
        <p>
          Comece pequeno, comemore muito e deixe que a criança sinta o gostinho de conquistar o que desejava com o próprio esforço. Essa sensação não tem preço — e é exatamente o que ela vai carregar para a vida adulta.
        </p>
      </>
    ),
  },
];

/* ── Helpers ── */
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — Blog KidsTasks`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}

/* ── Page ── */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "var(--font-jakarta, var(--font-geist-sans))" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="KidsTasks" width={40} height={40} />
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">KidsTasks</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 font-medium hidden sm:block">← Blog</Link>
            <Link href="/login" className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <section className="py-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium mb-6 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar ao blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">{article.tag}</span>
            <span className="text-sm text-gray-400">{article.readTime} de leitura</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-400">{article.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-5">{article.title}</h1>
          <p className="text-lg text-gray-500 leading-relaxed">{article.description}</p>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-14 px-6">
        <div
          className="max-w-3xl mx-auto text-gray-700 text-[15px] leading-relaxed space-y-5
            [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
            [&_li]:text-gray-700
            [&_strong]:text-gray-900 [&_strong]:font-semibold
            [&_em]:italic [&_em]:text-gray-600"
        >
          {article.content}
        </div>
      </article>

      {/* CTA */}
      <section className="py-14 px-6 bg-gradient-to-br from-violet-50 to-indigo-50 border-y border-violet-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">{article.emoji}</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Coloque isso em prática com o KidsTasks</h2>
          <p className="text-gray-600 mb-7">Tarefas, pontos, mesada virtual e recompensas — tudo em um só lugar para transformar a rotina da sua família.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="px-7 py-3.5 rounded-2xl text-white font-bold shadow-lg" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              Começar gratuitamente
            </Link>
            <Link href="/blog" className="px-7 py-3.5 rounded-2xl text-violet-700 font-bold bg-white border border-violet-200 hover:border-violet-400 transition">
              Ler mais artigos
            </Link>
          </div>
        </div>
      </section>

      {/* Related articles */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-extrabold text-gray-900 mb-7">Artigos relacionados</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {related.map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 h-24 flex items-center justify-center text-4xl">
                  {rel.emoji}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">{rel.tag}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-2 leading-snug group-hover:text-violet-700 transition-colors">{rel.title}</h3>
                  <p className="text-xs text-violet-600 font-semibold mt-2">Ler artigo →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Início</Link>
        <span className="mx-3">·</span>
        <Link href="/blog" className="hover:text-gray-600">Blog</Link>
        <span className="mx-3">·</span>
        <span>© {new Date().getFullYear()} KidsTasks. Todos os direitos reservados.</span>
      </footer>
    </main>
  );
}

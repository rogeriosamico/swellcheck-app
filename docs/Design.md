# DESIGN.md — Swell Check

> **Guardrails de documentação**
>
> Este arquivo contém intenção de produto, decisões de design e regras semânticas — não implementação.
>
> Tokens ativos, props, variantes, estados, autodocs e exemplos de uso vivem no **Storybook** (`/storybook`). Ele é a documentação viva e operacional do projeto. Em caso de conflito entre este arquivo e o Storybook ou o codebase, **o Storybook prevalece**.
>
> Não documente aqui: nomes de classe CSS, assinaturas de props, valores hardcoded, detalhes de layout ou qualquer informação que muda com refatorações de código.

---

## 1. Overview

### Visão do produto

App de previsão de surf que responde uma pergunta: **vale a pena surfar nessa praia hoje?**

- Público: surfistas amadores e intermediários, sem fluência em apps técnicos (Surf Guru, Windy)
- Contexto de uso: mobile, às pressas, antes de decidir alugar carro ou ir à praia
- Não é um painel de dados. É uma ferramenta de decisão.

### Princípios de design

**1. Uma resposta por praia** — O veredito (flat / marola / bom / storm) é o protagonista. Dados secundários existem para quem quer entender o porquê — não para todos.

**2. Clareza antes de completude** — Menos dados visíveis, mais precisão no que aparece. Informação que o usuário não consegue usar é obstáculo.

**3. Cor como sinal de condição** — Cor existe para uma função: indicar qualidade do mar. Fora do sistema de condições, a interface é preto e branco.

**4. Mobile first com toque real** — Área mínima de toque: 44px. Sem dependência de hover. Estados visíveis e resposta imediata a interações.

**5. Função antes de brand** — O MVP valida a lógica do produto. Tipografia expressiva e identidade visual são próxima fase.

---

## 2. Foundations

O sistema de design é baseado inteiramente em variáveis CSS com nomenclatura semântica. Nenhum valor de cor, tamanho ou espaço deve ser escrito diretamente em componentes — usar sempre os tokens correspondentes.

Os valores exatos, nomes de token e exemplos de uso de cada categoria estão documentados no Storybook.

**Cor** — Interface neutra (preto/branco/cinza) fora do sistema de condições. Quatro condições com três variantes de token cada: texto, sólido e gradiente. Nenhum outro uso de cor nomeada é permitido no sistema.

**Tipografia** — Família única (Space Grotesk), pesos 400 e 700. Classes token encapsulam tamanho e peso juntos — nunca aplicar separadamente em componentes.

**Espaçamento** — Escala de tokens de espaçamento. Únicos valores permitidos em componentes reutilizáveis.

**Radius** — Três tokens com papéis distintos. Cada componente tem um token atribuído — não escolher por preferência visual.

**Densidade** — Área mínima de toque de 44px definida como token. Aplicada em todos os elementos interativos isolados.

**Tema light/dark** — Tokens dark definidos mas **não aprovados para produção**. O app opera inteiramente em light mode até revisão de design.

---

## 3. Semantic rules

### O que cor significa

Cor é exclusivamente um indicador de condição do mar. Nenhuma outra cor nomeada existe no sistema.

### O que fica neutro

Tudo que não é condição usa apenas tokens neutros: navegação, títulos, botões, inputs, labels de dados, ícones, divisores, background do gráfico. Hierarquia visual é feita por tamanho tipográfico e posição, não por cor.

### Ênfase visual

O veredito do dia é o elemento de maior peso visual em qualquer tela. InfoBlock, SwellPowerBar e TideChart existem para suportar o veredito, não para competir com ele.

---

## 4. Component rules

Cada componente tem um escopo de uso definido. Não adaptar componentes de domínio para finalidades genéricas. Props, variantes, estados e exemplos vivem no **Storybook**.


---

## 5. Content UI rules

### Idioma e tom

A interface é inteiramente em português, com exceção de `"Flat"` e `"Storm"` — terminologia surf internacional mantida intencionalmente. Tom direto e coloquial, equivalente a um surfista experiente dando uma opinião rápida.

- **Correto:** "Vai surfar!", "Cuidado", "Vai depender"
- **Errado:** "Condições favoráveis", "Condições adversas detectadas", "Previsão moderada"

### Labels de condição

Texto fixo — não variar por contexto:

| Condição | Label | Descrição na legenda |
|---|---|---|
| storm | Storm | Cuidado |
| bom | Bom | Vai surfar! |
| marola | Marola | Vai depender |
| flat | Flat | Não vale a pena |

### Convenções de dados e terminologia

Unidades, formatos de hora, formatos de data e labels de seção têm convenções fixas documentadas no Storybook. Não inventar variações — consistência é parte da clareza do produto.

### Scanning de decisão

Nos InfoBlocks, o label aparece acima do valor — o usuário lê primeiro o que é, depois o número. Não inverter essa ordem.

---

## 6. Do & Don't

### Faça

- Use o veredito como elemento de maior hierarquia visual em qualquer tela
- Use linguagem direta e em português: "Vai surfar", "Cuidado", "Marola"
- Mantenha dados técnicos acessíveis mas secundários em relação ao veredito
- Verifique variantes, props e exemplos no Storybook antes de implementar algo novo
- Consulte o Figma como referência visual complementar — a fonte operacional é o Storybook

### Não Faça

- Não use cor para decoração — apenas para indicar condição do mar
- Não adicione dados visíveis sem checar se ajudam o usuário a decidir mais rápido
- Não crie componentes com valores hardcoded — usar sempre tokens do design system
- Não use termos técnicos de surf sem tradução para linguagem simples na UI
- Não implemente interações dependentes de hover em elementos críticos

---

## 7. Sources of truth

O **Storybook** é a documentação viva e operacional do projeto. Sempre atualizado com o codebase.

Consulte o Storybook para:

- Catálogo completo de tokens (cor, tipografia, espaçamento, radius, densidade) com valores reais
- Inventário de componentes com todas as variantes renderizadas
- Props e assinaturas de interface dos componentes
- Estados de loading, erro e vazio
- Composições e exemplos de uso
- Autodocs gerados do codebase
- Guidance de quando usar / não usar cada componente

| Fonte | O que resolve | Prioridade |
|---|---|---|
| **Storybook** (`/storybook`) | Documentação viva. Fonte operacional para foundations, tokens, componentes, props, estados e exemplos. | 1 — fonte primária |
| **Codebase** (`src/`) | Implementação. Resolve dúvidas técnicas não cobertas pelo Storybook. Divergência com Storybook indica item não documentado ou bug. | 2 — fonte técnica |
| **Design.md** (este arquivo) | Intenção de produto, decisões de design, regras semânticas. Não descreve implementação. | 3 — contexto estratégico |
| **Figma** | Referência visual. Pode estar desatualizado — confirmar no Storybook antes de usar como base de decisão. | 4 — referência visual |
| **App em produção** | Estado final observável. Divergências indicam bug ou deploy pendente. | 5 — validação final |

---

## 8. Needs confirmation

Itens definidos no sistema mas pendentes de aprovação ou formalização:

| Item | Status |
|---|---|
| Tema dark | Tokens definidos no CSS (herdados do shadcn), mas **não aprovados**. Valores de surface de condição no dark precisam de revisão antes do uso. |
| `--radius-full` | Definido no CSS. Sem uso implementado em nenhum componente atual. |
| `--text-brand` | Definido no CSS. Sem uso identificado — reservado para branding futuro. |
| Tokens de layout de página | Padding de tela (topo e base) sem token formal. Pendente de formalização. |

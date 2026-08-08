# Estados e mensagens

## Carregando — lista de praias

Exibe `HomeCardSkeleton` em quantidade igual ao total de praias cadastradas. Não exibe texto.

## Carregando — detalhe da praia

Exibe `BeachDetailSkeleton` ocupando toda a área de conteúdo. Não exibe texto.

## Carregando — próximos dias

Exibe `DayCardSkeleton` em quantidade igual a 7 (hoje + 6 dias). Não exibe texto.

## Nenhum resultado (busca)

```
"Nenhuma praia encontrada."
```

Tom neutro. Exibido quando a busca por texto não retorna correspondências. Cor: `--text-secondary`.

## Maré indisponível

```
"Dados de maré temporariamente indisponíveis."
```

Tom neutro, sem alarme. Exibido dentro de um bloco com ícone de informação (`opacity: 0.4`), fundo `--surface-terciary`, radius `--radius-minimal`. Não usa cor de condição.

## Erro de previsão

```
"Não foi possível carregar os dados."
```

Exibido centralizado, cor `--text-storm` — única exceção ao uso de cor de condição para estado de sistema. O erro de carregamento de previsão é tratado como situação de atenção do usuário, não erro genérico de interface.

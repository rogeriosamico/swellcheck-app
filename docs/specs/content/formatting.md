# Formatação de dados

## Unidades

| Tipo de dado | Formato | Exemplo |
|---|---|---|
| Altura de onda | `Xm` sem espaço | `1.5m` |
| Velocidade do vento | `X km/h` com espaço | `45 km/h` |
| Período do swell | `Xs` sem espaço | `8s` |
| Energia do swell | `X Kj` com espaço, K maiúsculo | `2.300 Kj` |

## Horas

Formato AM/PM em minúsculo, sem zeros à esquerda:

- `2am`, `6pm`, `12am`, `12pm`
- Escala do TimeSlider: `12am | 6am | 12pm | 6pm | 12am`
- Cabeçalho de dado horário: `"Condições às 6am"`

## Datas

| Contexto | Formato |
|---|---|
| Data atual (short) | `"Hoje"` |
| Data atual (completo) | `"Hoje, 12 de Maio de 2025"` |
| Outro dia (short) | `"Dom, 12 de Maio"` |
| Outro dia (completo) | `"Domingo, 12 de Maio de 2025"` |

As funções `shortDateLabel` e `parseDateLabel` em `src/lib/dates.js` aplicam esses formatos. Não formatar datas manualmente nos componentes — usar as funções existentes.

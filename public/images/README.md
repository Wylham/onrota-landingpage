# public/images — Guia de Imagens

Adicione as imagens nesta pasta. O site carrega automaticamente ao salvar o arquivo com o nome correto.

---

## Estrutura de pastas

```
public/images/
├── sections/       ← fundos e fotos das seções principais
├── services/       ← cards de serviços (2×2 grid)
└── team/           ← fotos de equipe (futuro uso)
```

---

## sections/

| Nome do arquivo        | Onde aparece            | Proporção ideal | Tamanho recomendado |
|------------------------|-------------------------|-----------------|---------------------|
| `hero-bg.jpg`          | Fundo do Hero           | 16:9 ou 16:10   | 1920×1080 px+       |
| `about-truck.jpg`      | Sobre — imagem principal| 3:4 (retrato)   | 900×1200 px         |
| `about-warehouse.jpg`  | Sobre — imagem menor    | 2:3 (retrato)   | 600×900 px          |
| `innovate-bg.jpg`      | Seção Inovar (banner)   | 16:9            | 1920×800 px         |
| `whyus-reliability.jpg`| Por que nós — card grande| 4:5            | 800×1000 px         |
| `whyus-coverage.jpg`   | Por que nós — cobertura | 4:3             | 800×600 px          |
| `whyus-support.jpg`    | Por que nós — suporte   | 4:3             | 800×600 px          |

## services/

| Nome do arquivo         | Onde aparece               | Proporção ideal |
|-------------------------|----------------------------|-----------------|
| `fracionada.jpg`        | Card Carga Fracionada       | 16:9            |
| `dedicada.jpg`          | Card Carga Dedicada         | 16:9            |
| `express.jpg`           | Card Entrega Expressa       | 16:9            |
| `distribuicao.jpg`      | Card Distribuição Urbana    | 16:9            |

---

## Dicas

- Formatos aceitos: **JPG, WebP** (preferir WebP para performance), PNG
- Use fotos **escuras** ou com **tons neutros** — o site aplica overlay gradiente por cima
- Evite fotos muito claras; as bordas e textos ficam sobre as imagens
- Tamanho máximo recomendado por arquivo: **500 KB** (comprimir em [squoosh.app](https://squoosh.app))

# Convite digital — Ágata Ractz

Convite estático, responsivo e interativo. Abra `dist/index.html` em um servidor HTTP local.

## Atualizar o evento

Os dados oficiais estão em `dist/event.js`: 08/01/2027 às 20h, MTK EVENTOS em Gravataí, traje social ou sport fino e WhatsApp (51) 99536-9340. A contagem regressiva usa um instante com o fuso oficial da festa (`-03:00`). O prazo de resposta inclui o dia 18/12/2026 inteiro em Gravataí. O botão de confirmação prepara a mensagem no WhatsApp; o convidado precisa revisar e tocar em **Enviar** para concluir. `musicSrc` pode apontar para um áudio hospedado com o site; o controle só aparece quando configurado.

## Visual e interação

A capa usa a arte enviada, com a inicial do lacre **A**. A animação abre o envelope com som breve e revela a carta. As telas internas preservam o fundo floral azul e dourado. O botão invisível cobre apenas o envelope e possui nome acessível para teclado e leitor de tela. Há suporte a movimento reduzido.

Depois de abrir o envelope, o visitante vê a data, o horário, a contagem regressiva e as opções **Confirmar presença**, **Ver localização** e **Dress Code**. A interface aberta usa uma camada de fundo limpa e molduras ornamentais sem textos impressos. Os números, os rótulos e os ícones dos botões são componentes HTML reais.

## Publicação na Vercel

O projeto é estático e não precisa de instalação de dependências nem de comando de build. O arquivo `vercel.json` seleciona o preset **Other** e publica diretamente a pasta `dist/`.

Ao importar `tidihunter40-hub/convite-agata-15-anos` na Vercel, use a raiz do repositório como **Root Directory**. O deploy de produção acompanha a branch principal configurada na integração Git. Não são necessárias variáveis de ambiente.

Para conferir localmente, sirva a pasta `dist/` por HTTP e abra a página inicial. Antes de divulgar o link, confira data, local, número de WhatsApp e prazo de confirmação em `dist/event.js`.

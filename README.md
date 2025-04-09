# Jogo do Tigrinho 

Um jogo de caça-níquel simples e divertido desenvolvido com HTML, CSS e JavaScript, com backend em Python.

## Características

- Interface moderna e responsiva
- Sistema de apostas com saldo virtual
- Animações suaves de giro
- Verificação de vitórias
- Multiplicador de prêmios (5x)
- Backend em Python com servidor HTTP

## Como Jogar

1. Inicie com 1000 moedas de saldo
2. Escolha sua aposta (mínimo 10 moedas)
   - Use os botões + e - para ajustar
3. Clique em "Girar" para jogar
4. Combine 3 símbolos iguais para ganhar
   - Prêmio: 5x o valor apostado

## Tecnologias Utilizadas

- Frontend:
  - HTML5
  - CSS3 (Animações e transições)
  - JavaScript (Vanilla)
- Backend:
  - Python
  - Sockets para servidor HTTP
  - PostgreSQL para banco de dados

## Como Executar

1. Certifique-se de ter Python instalado
2. Configure o PostgreSQL com as credenciais corretas em `server.py`
3. Execute o servidor:
   ```bash
   python server.py
   ```
4. Acesse no navegador:
   ```
   http://localhost:8080
   ```

## Estrutura do Projeto

- `index.html`: Interface principal do jogo
- `style.css`: Estilos e animações
- `script.js`: Lógica do jogo e interações
- `server.py`: Servidor HTTP e conexão com banco de dados
- `items/`: Pasta com imagens dos símbolos

## Próximas Melhorias

- [ ] Salvar saldo no banco de dados
- [ ] Adicionar sons e efeitos
- [ ] Diferentes multiplicadores por símbolo
- [ ] Sistema de níveis
- [ ] Tabela de recordes

## Segurança

**Nota**: Para ambiente de produção, considere:
- Implementar HTTPS
- Mover credenciais do banco para variáveis de ambiente
- Adicionar autenticação de usuários
- Implementar proteção contra trapaças

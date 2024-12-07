# Museu Virtual Interativo em Three.js

## Descrição do Projeto

Este projeto apresenta um museu virtual interativo desenvolvido em Three.js, no qual o usuário pode explorar um ambiente 3D, visualizar obras de arte antigas e acessar informações adicionais sobre elas. A aplicação permite a navegação em terceira pessoa, exibindo um avatar no ambiente, bem como o carregamento de vários modelos 3D texturizados e iluminados de forma realista.

**Principais funcionalidades:**

- **Iluminação realista:**  
   Uso de iluminação ambiente, direcional e pontos de luz para criar uma atmosfera agradável.
- **Texturas em superfícies:**  
   Texturas aplicadas em piso, paredes e teto, além do uso de materiais.
- **Carregamento de objetos 3D externos:**  
   Importação de múltiplos modelos GLTF/GLB posicionados no cenário, representando diversas esculturas e relíquias históricas. Cada obra possui informações contextuais e links para referência externa.
- **Navegação interativa:**  
   Controle de câmera em terceira pessoa usando teclas `W`, `A`, `S`, `D`.  
   O usuário pode "caminhar" pelo museu. Ao entrar em uma área demarcada (círculo azul), surgem informações sobre a obra correspondente.
- **Tema definido (Museu Virtual):**  
   O espaço simula um museu com diversas peças colocadas em um salão amplo, criando uma experiência imersiva de exploração e aprendizado.

## Tecnologias Utilizadas

- [Three.js](https://threejs.org/) para renderização 3D.
- [React](https://reactjs.org/) para estruturação da interface e componentes.

## Como Executar o Projeto Localmente

**Pré-requisitos:**

- Node.js (versão recomendada: LTS)
- NPM ou Yarn

**Passos para instalação e execução:**

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. **Instalar as dependências:**
   ```bash
   cd seu-repositorio
   npm install
   ```
   ou
   ```bash
   yarn
   ```
3. **Executar a aplicação em modo de desenvolvimento:**

   ```bash
   npm start
   ```

   ou

   ```bash
   yarn start
   ```

   Após a execução, abra o navegador e acesse:
   [http://localhost:3000](http://localhost:3000)

4. **Build de produção:**

   ```bash
   npm run build
   ```

   ou

   ```bash
   yarn build
   ```

   Os arquivos otimizados serão gerados na pasta `dist` ou `build` conforme sua configuração.

5. **Execução local estática:**
   ```bash
   npx serve build
   ```
   E então acessar o endereço fornecido no terminal.

## Controles de Navegação

- **W:** mover-se para frente
- **S:** mover-se para trás
- **A:** girar à esquerda (rotacionar avatar)
- **D:** girar à direita (rotacionar avatar)

Ao entrar em um círculo azul, informações sobre a obra correspondente serão exibidas no canto da tela.

## Créditos, Fontes e Referências

**Modelos 3D:**

- Adam (avatar): [Fonte do Modelo / Licença se houver]
- Demais modelos (Buddha, Effigy, Angel Sculpture, etc.): Links e créditos conforme indicado no código e no projeto. Cada obra possui um link contextual no pop-up de informações.
  - Buddha near Peshawar, Pakistan
  - Effigy of a Knight, Victoria and Albert Museum
  - Mourning Female Servant, Altes Museum
  - Angel Sculpture by Matteo Civitali
  - Muttergottes (Virgin Mary), Liebighaus Frankfurt
  - Pillar-shaped Cippus, Altes Museum, Berlin

**Texturas:**

- Piso, paredes e teto obtidos a partir de texturas livres, por exemplo:
  - Polyhaven
  - CC0 Textures

**Bibliotecas:**

- Three.js
- React
- GLTFLoader

## Equipe de Desenvolvimento

- [Seu Nome]
- [Nomes da Equipe se houver]

## Vídeo de Demonstração

Um vídeo curto (1-2 minutos) demonstrando a aplicação pode ser encontrado em:
[Link do Vídeo (YouTube ou outro serviço)]

## Licença

Este projeto é distribuído sob a licença MIT License.

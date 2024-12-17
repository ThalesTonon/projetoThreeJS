# Museu Virtual Interativo em Three.js

## Descrição do Projeto

Este projeto apresenta um museu virtual interativo desenvolvido em Three.js, no qual o usuário pode explorar um ambiente 3D, visualizar obras de arte antigas e acessar informações adicionais sobre elas. A aplicação permite a navegação em terceira pessoa, exibindo um avatar no ambiente, bem como o carregamento de vários modelos 3D texturizados e iluminados de forma realista.

## Vídeo no Youtube

[Projeto Museu Virtual - Three.js + React Vite](https://youtu.be/GpdEfzc8W7w)

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

## Deploy do projeto na WEB

[Acesse aqui](https://museuvirtual.vercel.app/)

## Como Executar o Projeto Localmente

**Pré-requisitos:**

- Node.js (versão recomendada: LTS)
- NPM ou Yarn

**Passos para instalação e execução:**

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/ThalesTonon/projetoThreeJS.git
   ```
2. **Instalar as dependências:**
   ```bash
   cd projetoThreeJS/museu
   npm install
   ```
   ou
   ```bash
   yarn
   ```
3. **Executar a aplicação em modo de desenvolvimento:**

   ```bash
   npm run dev
   ```

   ou

   ```bash
   yarn start
   ```

   Após a execução, abra o navegador e acesse:
   [http://localhost:5173](http://localhost:5173/)

4. **Build de produção:**

   ```bash
   npm run build
   ```

   ou

   ```bash
   yarn build
   ```

   Os arquivos otimizados serão gerados na pasta `dist`.

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

- Adam (avatar): [Fonte do Modelo](https://www.mixamo.com/#/?page=1&query=adam&type=Character)
- David (avatar): [Fonte do Modelo](https://www.mixamo.com/#/?page=1&query=david&type=Character)
- Jody (avatar): [Fonte do Modelo](https://www.mixamo.com/#/?page=1&query=jody&type=Character)
- Elizabeth (avatar): [Fonte do Modelo](https://www.mixamo.com/#/?page=1&query=elizabeth&type=Character)
- Demais modelos (Buddha, Effigy, Angel Sculpture, etc.): Links e créditos conforme indicado no código e no projeto. Cada obra possui um link contextual no pop-up de informações. Fonte de todas as artes: [Sketchfab](https://sketchfab.com/)
  - [Buddha near Peshawar, Pakistan](https://sketchfab.com/3d-models/buddha-near-peshawar-pakistan-28f352a2a67f42c7a3f4b148410b3dce)
  - [Effigy of a Knight, Victoria and Albert Museum](https://sketchfab.com/3d-models/effigy-of-a-knight-victoria-and-albert-museum-74f83358216a4698b7322faa0132c78b)
  - [Mourning Female Servant, Altes Museum](https://sketchfab.com/3d-models/mourning-female-servant-altes-museum-berlin-e615dd96a3d8463d903dad78f76db7ba)
  - [Angel Sculpture by Matteo Civitali](https://sketchfab.com/3d-models/angel-sculpture-by-matteo-civitali-c44411ccbd97489ab3097a0e09a3d137)
  - [Muttergottes (Virgin Mary), Liebighaus Frankfurt](https://sketchfab.com/3d-models/muttergottes-virgin-mary-liebighaus-frankfurt-2ebb8d700e0e410f9c22e62972b2e57b)
  - [Pillar-shaped Cippus, Altes Museum, Berlin](https://sketchfab.com/3d-models/pillar-shaped-cippus-altes-museum-berlin-ecc6ec191b214ba49d73b7c7aa29cc7f)

**Texturas:**

- Piso, paredes e teto obtidos a partir de texturas livres, por
  [texture.com](https://www.textures.com/)

**Bibliotecas:**

- Three.js
- React

## Equipe de Desenvolvimento

- Matheus Viana
- Thales Carretero Tonon
- Webert

## Licença

Este projeto é distribuído sob a licença MIT License.

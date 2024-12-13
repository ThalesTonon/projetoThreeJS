import "./AvatarSelection.css";

const AvatarSelection = ({ onSelectAvatar, setIsStarted }) => {
  const handleClicked = (avatar) => {
    onSelectAvatar(avatar);
    setIsStarted(true);
  };

  return (
    <div className="avatar-selection">
      <header className="header">
        <h1>Bem-vindo ao Museu Virtual</h1>
        <p>Escolha seu avatar para iniciar o tour</p>
      </header>
      <div className="avatars">
        <div
          className="avatar-card"
          onClick={() => handleClicked("avatares/elizabeth.glb")}
        >
          <img
            src="/perfilAvatar/elizabethAvatar.png"
            alt="Avatar Elizabeth"
            className="avatar-image"
          />
          <span className="avatar-name">Elizabeth</span>
        </div>
        <div
          className="avatar-card"
          onClick={() => handleClicked("avatares/david.glb")}
        >
          <img
            src="/perfilAvatar/davidAvatar.png"
            alt="Avatar David"
            className="avatar-image"
          />
          <span className="avatar-name">David</span>
        </div>
        <div
          className="avatar-card"
          onClick={() => handleClicked("avatares/jody.glb")}
        >
          <img
            src="/perfilAvatar/jodyAvatar.png"
            alt="Avatar Jody"
            className="avatar-image"
          />
          <span className="avatar-name">Jody</span>
        </div>
        <div
          className="avatar-card"
          onClick={() => handleClicked("avatares/adam.glb")}
        >
          <img
            src="/perfilAvatar/adamAvatar.png"
            alt="Avatar Adam"
            className="avatar-image"
          />
          <span className="avatar-name">Adam</span>
        </div>
      </div>
      <footer className="footer">Por Matheus Viana, Thales e Webert</footer>
    </div>
  );
};

export default AvatarSelection;

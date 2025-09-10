export const playClick = () => {
  const audio = new Audio("/music/Click.wav"); // served from /public/music/
  audio.play();
};

export const playClaim = () => {
  const audio = new Audio("/music/Claim.wav");
  audio.play();
};

export const playDeploy = () => {
  const audio = new Audio("/music/DeploySpacecraft.wav");
  audio.play();
};

export const playFailed = () => {
  const audio = new Audio("/music/FailedWalletConfirmation.wav");
  audio.play();
};

export const playButtonClick = () => {
  const audio = new Audio("/music/MiningCoreDatabaseRankingandManual.wav");
  audio.play();
};

export const playStart = () => {
  const audio = new Audio("/music/StartSystem.mp3");
  audio.play();
};

export const TransitionManager = {
  fadeTo(scene, targetScene) {
    if (scene.cameras && scene.cameras.main) {
      scene.cameras.main.fadeOut(300);
      scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start(targetScene));
    } else {
      scene.scene.start(targetScene);
    }
  }
};
window.TransitionManager = TransitionManager;
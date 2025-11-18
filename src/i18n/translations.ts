export type Language = 'en' | 'fr'

export interface Translations {
  resetPoints: string
  resetPointsTooltip: string
  resetPointsModalTitle: string
  resetPointsModalBody: string
  startNewMatch: string
  resetMatchTooltip: string
  resetMatchModalTitle: string
  resetMatchModalBody: string
  cancel: string
  swapEnds: string
  toggleServer: string
  adjustPositionsHeading: string
  resetsHeading: string
}

export const translations: Record<Language, Translations> = {
  en: {
    resetPoints: 'Reset points',
    resetPointsTooltip: 'Clears the current game score only',
    resetPointsModalTitle: 'Reset points?',
    resetPointsModalBody: 'Clears the ongoing game score but keeps match history.',
    startNewMatch: 'Start new match',
    resetMatchTooltip: 'Clears points, games, and history',
    resetMatchModalTitle: 'Start a new match?',
    resetMatchModalBody: 'Resets the full match so you can begin fresh.',
    cancel: 'Cancel',
    swapEnds: 'Swap ends',
    toggleServer: 'Toggle server',
    adjustPositionsHeading: 'Adjust positions',
    resetsHeading: 'Resets',
  },
  fr: {
    resetPoints: 'Réinitialiser les points',
    resetPointsTooltip: 'Efface uniquement le score en cours',
    resetPointsModalTitle: 'Réinitialiser les points ?',
    resetPointsModalBody: 'Efface le score de la partie mais conserve l’historique.',
    startNewMatch: 'Commencer un nouveau match',
    resetMatchTooltip: 'Efface points, jeux et historique',
    resetMatchModalTitle: 'Commencer un nouveau match ?',
    resetMatchModalBody: 'Réinitialise tout le match pour repartir de zéro.',
    cancel: 'Annuler',
    swapEnds: 'Échanger les côtés',
    toggleServer: 'Changer le serveur',
    adjustPositionsHeading: 'Ajuster les positions',
    resetsHeading: 'Remises à zéro',
  },
}

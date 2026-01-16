/**
 * French translations for Alecia Colab
 * All UI text should be in French for Phase 1
 */

export const fr = {
  // General
  app: {
    name: "Alecia Colab",
    tagline: "Plateforme de collaboration M&A",
  },

  // Navigation
  nav: {
    home: "Accueil",
    documents: "Documents",
    pipeline: "Pipeline",
    calendar: "Calendrier",
    settings: "Paramètres",
    recentlyOpened: "Récemment ouvert",
    workspace: "Espace de travail",
  },

  // Actions
  actions: {
    new: "Nouveau",
    newDeal: "Nouveau Deal",
    newDocument: "Nouveau Document",
    newCompanyProfile: "Nouveau Profil d'Entreprise",
    export: "Exporter",
    exportAsMarkdown: "Exporter en Markdown",
    share: "Partager",
    shareDocument: "Partager le Document",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    create: "Créer",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    quickActions: "Actions Rapides",
    quickNote: "Note Rapide",
    upload: "Téléverser",
    download: "Télécharger",
  },

  // Deal Pipeline
  pipeline: {
    title: "Pipeline des Deals",
    stages: {
      sourcing: "Sourcing",
      dueDiligence: "Due Diligence",
      negotiation: "Négociation",
      closing: "Clôture",
      closedWon: "Gagné",
      closedLost: "Perdu",
    },
    fields: {
      company: "Entreprise",
      companyName: "Nom de l'entreprise",
      valuation: "Valorisation",
      lead: "Responsable",
      dealLead: "Responsable du Deal",
      stage: "Étape",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
      dueDate: "Date d'échéance",
      priority: "Priorité",
      tags: "Tags",
    },
    priority: {
      high: "Haute",
      medium: "Moyenne",
      low: "Basse",
    },
    views: {
      kanban: "Kanban",
      table: "Tableau",
      calendar: "Calendrier",
      flow: "Flux",
    },
    noDealsFound: "Aucun deal trouvé.",
    createDeal: "Créer un Deal",
    moveToNextStage: "Passer à l'étape suivante",
    demoMode: "Mode Démo",
  },

  // Calendar
  calendar: {
    today: "Aujourd'hui",
    days: {
      short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      long: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    },
    months: {
      short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"],
      long: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
    },
  },

  // Theme
  theme: {
    appearance: "Apparence",
    system: "Système",
    light: "Clair",
    dark: "Sombre",
  },

  // Profile
  profile: {
    myProfile: "Mon Profil",
    settings: "Paramètres",
    logout: "Se Déconnecter",
    signIn: "Connexion",
  },

  // Editor
  editor: {
    title: "Éditeur",
    placeholder: "Commencez à écrire...",
    untitled: "Sans titre",
    format: "Format",
    template: "Modèle",
    history: "Historique",
  },

  // File Upload
  upload: {
    dragDrop: "Glisser-déposer ou",
    uploadFile: "Téléverser un fichier",
    dragDropHere: "ou glissez-déposez votre fichier ici",
    selectFile: "Sélectionner un fichier",
    uploading: "Téléversement en cours...",
    uploadSuccess: "Téléversement réussi",
    uploadError: "Erreur de téléversement",
  },

  // Loader
  loader: {
    loading: "Chargement...",
    configuringAccount: "Configuration de votre compte...",
    pleaseWait: "Veuillez patienter...",
    processing: "Traitement en cours...",
  },

  // Search
  search: {
    placeholder: "Rechercher...",
    commandTip: "⌘K pour ouvrir les commandes",
    escapeToCancel: "Échap pour annuler",
    noResults: "Aucun résultat trouvé",
    recentSearches: "Recherches récentes",
  },

  // Toolbar
  toolbar: {
    view: "Affichage",
    settings: "Paramètres",
  },

  // Dashboard
  dashboard: {
    welcome: "Bienvenue",
    welcomeBack: "Bon retour",
    quickActions: "Actions Rapides",
    recentDocuments: "Documents Récents",
    activityFeed: "Fil d'Activité",
    notifications: "Notifications",
    stats: {
      dealsInProgress: "Deals en cours",
      documentsCreated: "Documents créés",
      teamMembers: "Membres de l'équipe",
      tasksCompleted: "Tâches terminées",
    },
  },

  // Errors
  errors: {
    somethingWentWrong: "Une erreur s'est produite",
    tryAgain: "Réessayer",
    notFound: "Non trouvé",
    unauthorized: "Non autorisé",
    serverError: "Erreur du serveur",
  },

  // Success messages
  success: {
    saved: "Enregistré avec succès",
    created: "Créé avec succès",
    updated: "Mis à jour avec succès",
    deleted: "Supprimé avec succès",
  },

  // Forms
  form: {
    required: "Requis",
    optional: "Optionnel",
    enterValue: "Entrer une valeur",
    selectOption: "Sélectionner une option",
  },

  // Tabs
  tabs: {
    editor: "Éditeur",
    pipeline: "Pipeline",
  },
};

export type TranslationKeys = typeof fr;

export default fr;

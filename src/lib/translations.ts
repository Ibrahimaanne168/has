export type Language = "fr" | "en";

export const translations = {
  fr: {
    // Navbar
    nav_presentation: "Présentation",
    nav_matieres: "Matières",
    nav_marketplace: "Marketplace",
    nav_directeur: "Directeur",
    nav_contact: "Contact",
    nav_inscription: "Inscription",
    nav_connexion: "Connexion",
    nav_tagline: "Maths · Physique · Informatique",
    nav_badge_pdf: "PDF",

    // Marketplace Global & Card
    mkt_buy_now: "Acheter maintenant",
    mkt_order_whatsapp: "Commander via WhatsApp",
    mkt_downloadable: "Téléchargeable",
    mkt_downloadable_pdf: "Format PDF téléchargeable",
    mkt_official_doc: "Fascicule officiel HAS",
    mkt_off: "OFF",

    // Section Marketplace Accueil
    mkt_sec_badge: "Boutique Académique · Ressources Professeurs",
    mkt_sec_title: "Marketplace HAS : Fascicules & Corrigés",
    mkt_sec_desc:
      "Procurez-vous les supports PDF de haute valeur rédigés par vos enseignants : recueils d'examens décortiqués, formulaires et synthèses méthodologiques. Commandez directement sur WhatsApp avec validation administrative.",
    mkt_sec_explore: "Explorer tout le catalogue",
    mkt_sec_empty_title: "Le catalogue des fascicules est en cours d'enrichissement",
    mkt_sec_empty_desc:
      "Les enseignants et l'administration préparent les premiers fascicules d'exercices et annales corrigées. Vous pourrez bientôt les commander directement ici avec redirection WhatsApp et téléchargement sécurisé.",
    mkt_sec_access: "Accéder à l'espace Marketplace",
    mkt_sec_more_title: "Plus de fascicules disponibles dans le catalogue",
    mkt_sec_more_desc:
      "Consultez les exercices d'examens de L1 et L2 en Analyse, Algèbre, Physique, et Informatique.",

    // Page Catalogue (/marketplace)
    mkt_page_title: "Fascicules & Ressources Officielles",
    mkt_page_desc:
      "Commandez vos supports de cours directement via WhatsApp. Téléchargement immédiat et sécurisé de vos PDF après validation.",
    mkt_search_placeholder: "Rechercher par titre, enseignant ou matière...",
    mkt_filter_all_levels: "Tous niveaux",
    mkt_filter_l1: "Licence 1",
    mkt_filter_l2: "Licence 2",
    mkt_filter_all_subjects: "Toutes les matières",
    mkt_sort_featured: "Mis en avant",
    mkt_sort_price_asc: "Prix : Croissant",
    mkt_sort_price_desc: "Prix : Décroissant",
    mkt_sort_recent: "Plus récents",
    mkt_total_docs: "document(s) disponible(s)",
    mkt_reset_filters: "Réinitialiser les filtres",
    mkt_no_docs_title: "Aucun document ne correspond à vos critères",
    mkt_no_docs_desc:
      "Essayez d'élargir vos termes de recherche ou de retirer certains filtres de matières ou de niveaux.",
    mkt_view_all_docs: "Voir tous les fascicules",

    // Guide de commande
    mkt_guide_badge: "Processus Simple & Rapide",
    mkt_guide_title: "Comment commander un document ?",
    mkt_step1_title: "Sélectionnez le document",
    mkt_step1_desc: "Consultez la description, le sommaire, le nombre de pages et le prix fixé.",
    mkt_step2_title: "Cliquez sur Commander",
    mkt_step2_desc:
      "Une discussion WhatsApp s'ouvre avec votre référence de commande pré-remplie.",
    mkt_step3_title: "Téléchargement Validé",
    mkt_step3_desc:
      "Après validation administrative, téléchargez directement votre fascicule au format PDF.",

    // Page Produit (/marketplace/[id])
    mkt_back_catalog: "Retour au catalogue",
    mkt_not_found_title: "Document introuvable",
    mkt_not_found_desc:
      "Ce document n'existe pas ou a été retiré de la vente par l'administration.",
    mkt_files_included: "Fichiers inclus (1)",
    mkt_details: "Détails",
    mkt_description_summary: "Description & Sommaire",
    mkt_no_description: "Aucune description détaillée fournie pour ce fascicule.",
    mkt_official_badge_notice: "Fascicule officiel HAS · Format PDF haute qualité",
    mkt_order_sent_title: "Commande envoyée sur WhatsApp !",
    mkt_order_sent_desc:
      "La discussion WhatsApp a été ouverte. Dès validation du paiement, vous pouvez télécharger votre document directement ci-dessous.",
    mkt_your_order_code: "Votre Code de commande :",
    mkt_download_validated_btn: "Télécharger mon document validé",
    mkt_verifying: "Vérification...",
    mkt_your_full_name: "Votre Nom complet",
    mkt_your_whatsapp: "Votre Numéro WhatsApp",
    mkt_placeholder_name: "Ex: Ibrahima Diop",
    mkt_placeholder_phone: "+221 77 000 00 00",
    mkt_connect_whatsapp_btn: "Commander via WhatsApp",
    mkt_connecting_wa: "Connexion WhatsApp...",
    mkt_already_ordered_btn: "Déjà commandé ? Télécharger avec mon code",
    mkt_enter_code_or_phone: "Code de commande ou Numéro WhatsApp",
    mkt_placeholder_code_or_phone: "Ex: ord-... ou 77 000 00 00",
    mkt_download_btn: "Télécharger",
    mkt_admin_guarantee: "Validation administrative manuelle sécurisée par code.",
    mkt_download_success:
      "✓ Commande validée ! Votre document PDF est en cours de téléchargement sur votre appareil...",
    mkt_download_pending:
      "Votre commande est bien reçue mais toujours en attente de validation par l'administration après confirmation de votre paiement.",
    mkt_download_error_prefix: "Aucune commande validée trouvée avec ce code ou numéro.",
  },
  en: {
    // Navbar
    nav_presentation: "About Us",
    nav_matieres: "Subjects",
    nav_marketplace: "Marketplace",
    nav_directeur: "Director",
    nav_contact: "Contact",
    nav_inscription: "Register",
    nav_connexion: "Login",
    nav_tagline: "Maths · Physics · Computer Science",
    nav_badge_pdf: "PDF",

    // Marketplace Global & Card
    mkt_buy_now: "Buy now",
    mkt_order_whatsapp: "Order via WhatsApp",
    mkt_downloadable: "Downloadable",
    mkt_downloadable_pdf: "Downloadable PDF format",
    mkt_official_doc: "Official HAS Booklet",
    mkt_off: "OFF",

    // Section Marketplace Accueil
    mkt_sec_badge: "Academic Store · Teachers' Resources",
    mkt_sec_title: "HAS Marketplace: Booklets & Solved Exams",
    mkt_sec_desc:
      "Get high-value PDF materials written by your teachers: solved exams, cheat sheets, and methodological summaries. Order directly on WhatsApp with administration validation.",
    mkt_sec_explore: "Explore full catalogue",
    mkt_sec_empty_title: "The booklet catalogue is currently being populated",
    mkt_sec_empty_desc:
      "Teachers and administration are preparing the first exercise booklets and solved exam archives. You will soon be able to order them here directly with WhatsApp redirection and secure downloads.",
    mkt_sec_access: "Go to Marketplace",
    mkt_sec_more_title: "More booklets available in the catalogue",
    mkt_sec_more_desc:
      "Browse undergraduate exam exercises in Analysis, Algebra, Physics, and Computer Science.",

    // Page Catalogue (/marketplace)
    mkt_page_title: "Official Booklets & Resources",
    mkt_page_desc:
      "Order your course materials directly via WhatsApp. Instant, secure download of your PDF files upon validation.",
    mkt_search_placeholder: "Search by title, teacher or subject...",
    mkt_filter_all_levels: "All levels",
    mkt_filter_l1: "Bachelor Year 1 (L1)",
    mkt_filter_l2: "Bachelor Year 2 (L2)",
    mkt_filter_all_subjects: "All subjects",
    mkt_sort_featured: "Featured",
    mkt_sort_price_asc: "Price: Low to High",
    mkt_sort_price_desc: "Price: High to Low",
    mkt_sort_recent: "Most recent",
    mkt_total_docs: "available document(s)",
    mkt_reset_filters: "Reset filters",
    mkt_no_docs_title: "No document matches your criteria",
    mkt_no_docs_desc:
      "Try broadening your search terms or clearing some subject or level filters.",
    mkt_view_all_docs: "View all booklets",

    // Guide de commande
    mkt_guide_badge: "Quick & Simple Process",
    mkt_guide_title: "How to order a document?",
    mkt_step1_title: "Select your booklet",
    mkt_step1_desc: "Check description, table of contents, page count and price.",
    mkt_step2_title: "Click on Order",
    mkt_step2_desc:
      "A WhatsApp chat opens with your pre-filled order reference.",
    mkt_step3_title: "Validated Download",
    mkt_step3_desc:
      "Once validated by administration, download your PDF document directly.",

    // Page Produit (/marketplace/[id])
    mkt_back_catalog: "Back to catalogue",
    mkt_not_found_title: "Document not found",
    mkt_not_found_desc:
      "This document does not exist or has been removed from sale by administration.",
    mkt_files_included: "Included files (1)",
    mkt_details: "Details",
    mkt_description_summary: "Description & Table of Contents",
    mkt_no_description: "No detailed description provided for this booklet.",
    mkt_official_badge_notice: "Official HAS booklet · High quality PDF format",
    mkt_order_sent_title: "Order sent on WhatsApp!",
    mkt_order_sent_desc:
      "WhatsApp chat has been opened. Once payment is confirmed, you can download your document directly below.",
    mkt_your_order_code: "Your Order Code:",
    mkt_download_validated_btn: "Download my validated document",
    mkt_verifying: "Verifying...",
    mkt_your_full_name: "Your Full Name",
    mkt_your_whatsapp: "Your WhatsApp Number",
    mkt_placeholder_name: "e.g. John Doe",
    mkt_placeholder_phone: "+221 77 000 00 00",
    mkt_connect_whatsapp_btn: "Order via WhatsApp",
    mkt_connecting_wa: "Opening WhatsApp...",
    mkt_already_ordered_btn: "Already ordered? Download with my code",
    mkt_enter_code_or_phone: "Order Code or WhatsApp Number",
    mkt_placeholder_code_or_phone: "e.g. ord-... or 77 000 00 00",
    mkt_download_btn: "Download",
    mkt_admin_guarantee: "Secure manual administrative validation by code.",
    mkt_download_success:
      "✓ Order validated! Your PDF document is downloading to your device...",
    mkt_download_pending:
      "Your order has been received but is pending validation by administration after payment verification.",
    mkt_download_error_prefix: "No validated order found with this code or phone number.",
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

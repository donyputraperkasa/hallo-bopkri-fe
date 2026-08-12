const defaultMessage = "Halo masdon, saya butuh bantuan untuk Hallo BOPKRI.";

// Nilai dapat diarahkan ke nomor IT melalui .env.local tanpa mengubah komponen.
export const itWhatsappUrl =
  process.env.NEXT_PUBLIC_IT_WHATSAPP_URL ??
  `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;

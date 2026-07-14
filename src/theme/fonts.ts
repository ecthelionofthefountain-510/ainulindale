/**
 * Typography for Arda. Cormorant Garamond for display/headings (elegant, high
 * contrast), EB Garamond for body/reading text. Family names match the exports
 * from @expo-google-fonts and are registered in the root layout.
 */

export const AppFonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayMedium: 'CormorantGaramond_500Medium',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'EBGaramond_400Regular',
  bodyMedium: 'EBGaramond_500Medium',
  bodyItalic: 'EBGaramond_400Regular_Italic',
} as const;

export type AppFontKey = keyof typeof AppFonts;

import TranslationOutput from '../ui/TranslationOutput';

const LiveDetectionTranslation = () => (
  <TranslationOutput
    delay={0.2}
    showCopy
    showLanguageTranslation
    pastDefault="was..."
    presentDefault="..."
    futureDefault="will..."
  />
);

export default LiveDetectionTranslation;

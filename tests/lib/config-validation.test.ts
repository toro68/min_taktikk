import { validateAndSanitizeConfig } from '../../src/lib/config';

describe('config validation and sanitization', () => {
  it('accepts a valid minimal config shape without warnings', () => {
    const input = {
      version: '1.2',
      settings: {
        toolbar: { layout: 'split' },
        lineStyles: {
          curveRange: { min: -300, max: 300, step: 5 },
          colors: [{ key: 'black', label: 'Svart', value: '#000000' }],
        },
        keyframes: { features: { downloadPng: { enabled: true, tooltip: 'x' } } },
        traces: { enabled: true, curveRange: { min: -200, max: 200, step: 2 } },
        pitchTypes: ['offensive', 'defensive'],
        guidelines: { modes: ['lines', 'colors'] },
      },
    };

    const { config, warnings } = validateAndSanitizeConfig(input);

    expect(config.version).toBe('1.2');
    expect(config.settings.pitchTypes).toEqual(['offensive', 'defensive']);
    expect(config.settings.lineStyles.curveRange).toEqual({ min: -300, max: 300, step: 5 });
    expect(warnings).toHaveLength(0);
  });

  it('falls back for invalid nested fields and returns warnings', () => {
    const input = {
      version: '2.0',
      settings: {
        toolbar: { layout: 'split' },
        lineStyles: {
          curveRange: { min: 10, max: 0, step: -1 },
          colors: [],
        },
        keyframes: { features: { downloadPng: { enabled: true, tooltip: 'ok' } } },
        traces: {
          enabled: 'yes',
          curveRange: { min: -50, max: 50, step: 0 },
        },
        pitchTypes: ['offensive'],
        guidelines: { modes: ['full'] },
        exportPresets: {
          mp4: { fps: -30, preset: 'invalid-preset' },
        },
        ui: {
          animations: { enabled: 'yes', duration: -10 },
        },
      },
    } as any;

    const { config, warnings } = validateAndSanitizeConfig(input);

    expect(warnings.length).toBeGreaterThan(0);
    expect(config.settings.lineStyles.curveRange.min).toBeLessThan(config.settings.lineStyles.curveRange.max);
    expect(config.settings.lineStyles.colors.length).toBeGreaterThan(0);
    expect(config.settings.traces.enabled).toBe(true);
    expect((config.settings.exportPresets?.mp4?.fps || 0)).toBeGreaterThan(0);
    expect(config.settings.ui?.animations.enabled).toBe(true);
    expect((config.settings.ui?.animations.duration || 0)).toBeGreaterThan(0);
  });

  it('returns full default fallback when root is invalid', () => {
    const { config, warnings } = validateAndSanitizeConfig(null);

    expect(config.settings.toolbar.layout).toBe('split');
    expect(config.settings.pitchTypes.length).toBeGreaterThan(0);
    expect(warnings).toContain('Konfigurasjonsroten er ugyldig, bruker standardkonfigurasjon.');
  });
});

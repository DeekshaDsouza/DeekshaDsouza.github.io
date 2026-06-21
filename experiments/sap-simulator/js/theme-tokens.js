(function applyThemeTokens() {
    const hues = {
        base: 192,
        accent: 11,
        warm: 36,
        success: 151,
        danger: 4,
        info: 204
    };

    const root = document.documentElement;

    Object.entries(hues).forEach(([name, value]) => {
        root.style.setProperty(`--hue-${name}`, value);
    });

    root.dataset.theme = 'deeksha';
}());

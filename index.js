const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModuleByDisplayName, i18n: { Messages }, React } = require('powercord/webpack');

const Settings = require('./Settings');

const defaultMaxVolume = 400;
let pluginSettings;

module.exports = class CustomVolumeRange extends Plugin {
    startPlugin() {
        this.defaultMaxVolume = defaultMaxVolume;
        pluginSettings = this.settings;
        this.adjustVolumeSlider();
        powercord.api.settings.registerSettings('custom-volume-range-settings', {
            category: this.entityID,
            label: 'Custom Volume Range',
            render: props => React.createElement(Settings, {
                ...props,
                plugin: this
            })
        });
    }

    adjustVolumeSlider() {
        const Slider = getModuleByDisplayName('Slider', false);
        inject('custom-volume-range', Slider.prototype, 'render', function (args) {
            // pluginSettings must be a separate variable because 'this' refers to the module we inject into
            const maxVolume = pluginSettings.get('maxAdjustableVolume', this.defaultMaxVolume);
            // only change range if label is 'Input Volume'
            if (this && this.props['aria-label'] === Messages.FORM_LABEL_INPUT_VOLUME) {
                this.props.maxValue = maxVolume;
                this.state.value = this.state.initialValueProp;
                this.state.max = maxVolume;
                this.state.range = this.state.max;
            }
            return args;
        }, true);
    }

    pluginWillUnload() {
        uninject('custom-volume-range');
        powercord.api.settigs.unregisterSettings('custom-volume-range-settings');
    }
};

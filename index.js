const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModuleByDisplayName, i18n: { Messages }, React } = require('powercord/webpack');

const Settings = require('./Settings');

const defaultMaxVolume = 400;
const defaultMaxStreamVolume = 400;

module.exports = class CustomVolumeRange extends Plugin {
    startPlugin() {
        this.adjustVolumeSlider();
        powercord.api.settings.registerSettings('custom-volume-range_settings', {
            category: this.entityID,
            label: 'Custom Volume Range',
            render: props => React.createElement(Settings, {
                ...props,
                defaultMaxVolume,
                defaultMaxStreamVolume
            })
        });
    }

    adjustVolumeSlider() {
        const Slider = getModuleByDisplayName('Slider', false);

        // pluginSettings must be a separate variable because 'this' refers to the module we inject into
        let pluginSettings = this.settings;

        // User volume
        inject('custom-volume-range_userslider', Slider.prototype, 'render', function (args) {
            const maxVolume = pluginSettings.get('maxAdjustableVolume', defaultMaxVolume);
            // only change range if label is 'User Volume'
            if (this.props && this.props['aria-label'] === Messages.USER_VOLUME) {
                this.props.maxValue = maxVolume;
                this.state.value = this.state.initialValueProp;
                this.state.max = maxVolume;
                this.state.range = this.state.max;
            }
            return args;
        }, true);

        // Stream volume (slider on right-click)
        inject('custom-volume-range_streamslider', Slider.prototype, 'render', function (args) {
            const maxVolume = pluginSettings.get('maxAdjustableStreamVolume', defaultMaxStreamVolume);
            // only change range if label is 'Stream Volume'
            if (this.props && this.props['aria-label'] === Messages.STREAM_VOLUME) {
                this.props.maxValue = maxVolume;
                this.state.value = this.state.initialValueProp;
                this.state.max = maxVolume;
                this.state.range = this.state.max;
            }
            return args;
        }, true);
    }

    pluginWillUnload() {
        uninject('custom-volume-range_userslider');
        uninject('custom-volume-range_streamslider');
        powercord.api.settings.unregisterSettings('custom-volume-range_settings');
    }
};

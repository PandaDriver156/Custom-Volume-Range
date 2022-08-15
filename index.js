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

        inject('custom-volume-range_slider', Slider.prototype, 'render', function (args) {
            if (this.props) {
                let maxVolume = 0;
                // only change range if label is 'User Volume' or 'Stream Volume'
                switch (this.props['aria-label']) {
                    case Messages.USER_VOLUME:
                        maxVolume = pluginSettings.get('maxAdjustableVolume', defaultMaxVolume);
                        break;
                    case Messages.STREAM_VOLUME:
                        maxVolume = pluginSettings.get('maxAdjustableStreamVolume', defaultMaxStreamVolume);
                        break;
                    default:
                        return args;
                }

                this.props.maxValue = maxVolume;
                this.state.value = this.state.initialValueProp;
                this.state.max = maxVolume;
                this.state.range = this.state.max;
            }
            return args;
        }, true);
    }

    pluginWillUnload() {
        uninject('custom-volume-range_slider');
        powercord.api.settings.unregisterSettings('custom-volume-range_settings');
    }
};

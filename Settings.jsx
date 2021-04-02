const { React } = require('powercord/webpack');
const { TextInput } = require('powercord/components/settings');

module.exports = class LargerVolumeRangeSettings extends React.Component {
  render() {
    const { getSetting, updateSetting } = this.props;
    return (
      <TextInput
        note="Maximum adjustable volume on the volume slider"
        defaultValue={getSetting("maxAdjustableVolume", this.props.plugin.defaultMaxVolume)}
        onChange={(value) =>
          !isNaN(value) ? updateSetting("maxAdjustableVolume", Number(value)) : null
        }
      >
        Max Volume
      </TextInput>
    )
  }
};

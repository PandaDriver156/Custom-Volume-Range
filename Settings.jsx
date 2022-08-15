const { React } = require('powercord/webpack');
const { TextInput } = require('powercord/components/settings');

module.exports = class LargerVolumeRangeSettings extends React.Component {
  render() {
    const { getSetting, updateSetting } = this.props;
    return (
      <div>
        <TextInput
          note="Maximum allowed volume for users"
          defaultValue={getSetting("maxAdjustableVolume", this.props.defaultMaxVolume)}
          onChange={(value) =>
            !isNaN(value) ? updateSetting("maxAdjustableVolume", Number(value)) : null
          }
        >
          Max User Volume
        </TextInput>


        <TextInput
          note="Maximum allowed volume for streams"
          defaultValue={getSetting("maxAdjustableStreamVolume", this.props.defaultMaxStreamVolume)}
          onChange={(value) =>
            !isNaN(value) ? updateSetting("maxAdjustableStreamVolume", Number(value)) : null
          }
        >
          Max Stream Volume
        </TextInput>
      </div>
    )
  }
};

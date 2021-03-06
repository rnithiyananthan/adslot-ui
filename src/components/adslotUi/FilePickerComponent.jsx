import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Button from 'react-bootstrap/lib/Button';

require('styles/adslotUi/FilePicker.scss');

const baseClass = 'filepicker-component';

class FilePickerComponent extends React.Component {
  constructor() {
    super();
    this.state = { fileName: '' };
    this.onChange = this.onChange.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  onChange(changeEvent) {
    this.setState({ fileName: changeEvent.target.files[0].name });
    this.props.onSelect(changeEvent.target.files[0]);
  }

  removeFile() {
    this.setState({ fileName: '' });
    if (this.props.onRemove) { this.props.onRemove(); }
  }

  render() {
    const mainClass = classNames({ [`${baseClass}-highlight`]: this.props.isHighlighted }, baseClass, 'input-group');
    const { fileName } = this.state;
    const onClickHandler = () => {
      this.fileInput.click();
    };

    return (
      <div className={mainClass}>
        <input
          className="form-control"
          type="text"
          disabled
          placeholder={this.props.placeholder}
          readOnly="readonly"
          value={fileName}
          title={fileName}
        />
        <div className="input-group-btn">
          {fileName ? <Button className="remove-file" onClick={this.removeFile}>×</Button> : null}
          {!fileName && !this.props.disabled ?
            <Button className="btn-inverse" onClick={onClickHandler}>
              <span>{this.props.label}</span>
              <input
                className="file-input"
                ref={
                  (inputElementRef) => { this.fileInput = inputElementRef; }
                }

                type="file"
                onChange={this.onChange}
                accept={this.props.filter}
                data-test-selector={this.props.dts}
              />
            </Button>
          :
            <Button bsStyle="primary" disabled>{this.props.label}</Button>
          }
        </div>
      </div>
    );
  }
}

FilePickerComponent.propTypes = {
  disabled: PropTypes.bool,
  dts: PropTypes.string,
  filter: PropTypes.string,
  isHighlighted: PropTypes.bool,
  label: PropTypes.string,
  onRemove: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

FilePickerComponent.defaultProps = {
  isHighlighted: false,
  label: 'Select',
  placeholder: 'No file selected',
};

export default FilePickerComponent;

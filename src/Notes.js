import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdSpeakerNotes } from 'react-icons/md';
import parseISO from 'date-fns/parseISO';
import formatDistance from 'date-fns/formatDistance';
import format from 'date-fns/format';
import { readableColor, shade } from 'polished';

// eslint-disable-next-line import/no-unresolved
import client from 'part:@sanity/base/client';
// eslint-disable-next-line import/no-unresolved
// import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
// eslint-disable-next-line import/no-unresolved
import Button from 'part:@sanity/components/buttons/default'; // eslint-disable-line import/no-unresolved
import Spinner from 'part:@sanity/components/loading/spinner'; // eslint-disable-line import/no-unresolved

import styles from './Notes.css';

class Notes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _updatedAt: null,
      notes: '',
      draftNotes: '',
      isCreatingDraft: false,
      isSaving: false,
    };
  }

  UNSAFE_componentWillMount = () => {
    client.createIfNotExists({
      _id: 'dashboard.note',
      _type: 'dashboardNote',
      notes: '',
    });
  };

  componentDidMount = () => {
    client.getDocument('dashboard.note').then(({ _updatedAt, notes }) => {
      this.setState({
        _updatedAt,
        notes,
        draftNotes: notes,
      });
    });

    this.unsubscribe();
    this.subscription = client.listen("*[_id == 'dashboard.note']").subscribe(({ result }) => {
      const { _updatedAt, notes } = result;

      this.setState({
        _updatedAt,
        notes,
        draftNotes: notes,
      });
    });
  };

  handleChange = (e) => {
    this.setState({
      draftNotes: e.target.value,
      isCreatingDraft: true,
    });
  };

  handleSubmit = () => {
    const { draftNotes } = this.state;
    this.setState({ isSaving: true });

    client
      .patch('dashboard.note')
      .set({ notes: draftNotes })
      .commit()
      .then((updatedDocument) => {
        this.setState({
          _updatedAt: updatedDocument._updatedAt, // eslint-disable-line no-underscore-dangle
          notes: draftNotes,
          isCreatingDraft: false,
          isSaving: false,
        });
      })
      .catch((err) => {
        this.setState({
          isSaving: false,
        });

        console.error('Oh no, the update failed: ', err.message); // eslint-disable-line no-console
      });
  };

  handleDiscard = () => {
    const { notes } = this.state;

    this.setState({
      draftNotes: notes,
      isCreatingDraft: false,
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  render() {
    const { error, _updatedAt, draftNotes, isCreatingDraft, isSaving } = this.state;

    const { title, placeholder, backgroundColor, color } = this.props;

    const textColor = color || readableColor(backgroundColor, 'rgb(48, 48, 48)');

    return (
      <div className={styles.container}>
        {isSaving && (
          <div className={styles.spinnerContainer}>
            <Spinner center message="Saving notes…" />
          </div>
        )}
        <header
          className={styles.header}
          style={{
            backgroundColor: shade(0.05, backgroundColor),
            color: textColor,
          }}
        >
          <h2 className={styles.title}>
            {title}
            <MdSpeakerNotes className={styles.headerIcon} style={{ fill: textColor }} />
            {_updatedAt && (
              <span title={format(parseISO(_updatedAt), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}>
                {`Edited ${formatDistance(parseISO(_updatedAt), new Date(), { addSuffix: true })}`}
              </span>
            )}
          </h2>
        </header>
        {error ? (
          <div className={styles.content} style={{ backgroundColor }}>
            <code>Could not load notes …</code>
          </div>
        ) : (
          <>
            <div className={styles.content} style={{ backgroundColor }}>
              <textarea
                spellCheck="false"
                className={styles.textarea}
                name="notes"
                value={draftNotes}
                onChange={this.handleChange}
                placeholder={placeholder}
                style={{ color: textColor }}
              />
            </div>
            <div className={styles.footer} style={{ borderTopColor: shade(0.05, backgroundColor) }}>
              <Button
                bleed
                color="primary"
                kind="simple"
                onClick={this.handleSubmit}
                disabled={!isCreatingDraft}
              >
                Save notes
              </Button>

              <Button
                bleed
                color="danger"
                kind="simple"
                onClick={this.handleDiscard}
                disabled={!isCreatingDraft}
              >
                Discard changes
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }
}

Notes.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
};

Notes.defaultProps = {
  title: 'Notes',
  placeholder: '…',
  backgroundColor: '#ffff88',
  color: null,
};

export default Notes;

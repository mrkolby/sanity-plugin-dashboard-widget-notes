import React, { Component, Fragment } from 'react';
import { MdSpeakerNotes } from 'react-icons/md';
import { format, distanceInWordsToNow } from 'date-fns';

// eslint-disable-next-line import/no-unresolved
import client from 'part:@sanity/base/client';
// eslint-disable-next-line import/no-unresolved
// import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
// eslint-disable-next-line import/no-unresolved
import Button from 'part:@sanity/components/buttons/default'; // eslint-disable-line import/no-unresolved

import styles from './Notes.css';

class Notes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _updatedAt: null,
      notes: '',
      draftNotes: '',
      isCreatingDraft: false,
    };
  }

  componentWillMount = () => {
    client.createIfNotExists({
      _id: 'dashboard.note',
      _type: 'dashboardNote',
      notes: '',
    });
  }

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
  }

  handleChange = (e) => {
    this.setState({
      draftNotes: e.target.value,
      isCreatingDraft: true,
    });
  }

  handleSubmit = () => {
    const { draftNotes } = this.state;

    client
      .patch('dashboard.note')
      .set({ notes: draftNotes })
      .commit()
      .then((updatedDocument) => {
        this.setState({
          _updatedAt: updatedDocument._updatedAt, // eslint-disable-line no-underscore-dangle
          notes: draftNotes,
          isCreatingDraft: false,
        });
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message); // eslint-disable-line no-console
      });
  }

  handleDiscard = () => {
    const { notes } = this.state;

    this.setState({
      draftNotes: notes,
      isCreatingDraft: false,
    });
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  render() {
    const {
      error, _updatedAt, draftNotes, isCreatingDraft,
    } = this.state;

    const timestamp = format(_updatedAt, 'MMM D, YYYY, h:mm A Z');

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Notes
            <MdSpeakerNotes className={styles.headerIcon} />
            {_updatedAt && (
              <span title={timestamp}>
                {`Edited ${distanceInWordsToNow(_updatedAt, { addSuffix: true })}`}
              </span>
            )}
          </h2>
        </header>
        {error ? (
          <div className={styles.content}>
            <code>Could not load dashboard notes ...</code>
          </div>
        ) : (
          <Fragment>
            <div className={styles.content}>
              <textarea
                spellCheck="false"
                className={styles.textarea}
                name="notes"
                value={draftNotes}
                onChange={this.handleChange}
                placeholder="..."
              />
            </div>
            {isCreatingDraft && (
              <div className={styles.footer}>
                <Button color="primary" kind="simple" onClick={this.handleSubmit}>
                  Save notes
                </Button>

                <Button kind="simple" onClick={this.handleDiscard}>
                  Discard changes
                </Button>
              </div>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default Notes;

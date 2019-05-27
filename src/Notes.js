import React, { Component, Fragment } from 'react';
import {MdSpeakerNotes} from 'react-icons/md';
import {format, distanceInWordsToNow} from 'date-fns';

import client from 'part:@sanity/base/client';
import {PatchEvent, set, unset} from 'part:@sanity/form-builder/patch-event'
import Button from 'part:@sanity/components/buttons/default';

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

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
  }
  componentWillMount() {
    client.createIfNotExists({ _id: 'dashboard.note', _type: 'dashboardNote', notes: ''})
  }
  componentDidMount() {
    client.getDocument('dashboard.note').then(document => {
      console.log(document)
      const {_updatedAt, notes } = document
      this.setState({_updatedAt, notes, draftNotes: notes })
    })
    this.subscription = client.listen(`*[_id == 'dashboard.note']`).subscribe(({result}) => {
      const { _updatedAt, notes } = result
      this.setState({ _updatedAt, notes, draftNotes: notes })
    })
  }

  handleChange(e) {
    this.setState({
      draftNotes: e.target.value,
      isCreatingDraft: true,
    });
  }

  handleSubmit() {
    const { draftNotes } = this.state;

    client
      .patch('dashboard.note')
      .set({ notes: draftNotes })
      .commit()
      .then((updatedDocument) => {
        console.log(updatedDocument)
        this.setState({
          _updatedAt: updatedDocument._updatedAt,
          notes: draftNotes,
          isCreatingDraft: false,
        })
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message);
      });
  }

  handleDiscard() {
    const { notes } = this.state;

    this.setState({
      draftNotes: notes,
      isCreatingDraft: false,
    })
  }

  render() {
    const { error, updatedAt, notes, draftNotes, isCreatingDraft } = this.state;
    const timestamp = format(updatedAt, 'MMM D, YYYY, h:mm A Z');

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Notes
            <MdSpeakerNotes className={styles.headerIcon} />
            {updatedAt && <span title={timestamp}>Edited {distanceInWordsToNow(updatedAt, { addSuffix: true })}</span>}
          </h2>
        </header>
        {error ? (
          <p>Could not load dashboard notes</p>
        ) : (
          <Fragment>
            <div className={styles.content}>
              <textarea
                spellCheck="false"
                className={styles.textarea}
                name="notes"
                value={draftNotes}
                onChange={this.handleChange}
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

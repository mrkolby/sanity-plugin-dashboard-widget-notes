import React, { Component } from 'react';
import Icon from 'react-icons/lib/md/speaker-notes'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import format from 'date-fns/format'

import sanityClient from 'part:@sanity/base/client';
import Button from 'part:@sanity/components/buttons/default';

import styles from './Notes.css';

const query = `*[_id == "global-config"] {
  _updatedAt,
  dashboardNotes,
}[0]`;

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedAt: null,
      notes: '',
      draftNotes: '',
      isCreatingDraft: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
  }

  componentDidMount() {
    sanityClient.fetch(query).then(({ _updatedAt, dashboardNotes }) => {
      this.setState({
        "updatedAt": _updatedAt,
        notes: dashboardNotes,
        draftNotes: dashboardNotes,
      });
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

    sanityClient
      .patch('global-config')
      .set({ dashboardNotes: draftNotes })
      .commit()
      .then((updatedDocument) => {
        this.setState({
          updatedAt: updatedDocument._updatedAt,
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
    const timestamp = format(updatedAt, 'MMM D, YYYY, h:mm A Z')

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Notes
            <Icon className={styles.headerIcon} />
            {updatedAt && <span title={timestamp}>{distanceInWordsToNow(updatedAt, { addSuffix: true })}</span>}
          </h2>
        </header>
        {error ? (
          <p>Could not load dashboard notes</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    );
  }
}

export default Notes;

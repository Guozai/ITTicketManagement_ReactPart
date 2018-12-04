import React, { Component } from 'react';
import { apiurl } from '../helpers/constants';
// import trim from 'trim';

class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.state = {
            comment: ''
        };
    }

    onChange(e) {
        this.setState({
            comment: e.target.value
        });
    }

    onKeyUp(e) {
        var ticket_id = this.props.ticket_id
        if (e.keyCode === 13 && e.target.value !== '') {
            e.preventDefault();
            let dbCon = this.props.db.database().ref('/comment');
            dbCon.push({
                ticket_id: 3,
                comment: e.target.value
            });
            this.setState({
                comment: ''
            });

            // const comment = {
            //     comment: e.target.value,
            //     ticket: this.props.ticket_id
            // };
            //
            // fetch(apiurl + '/api/comments/new', {
            //     method: 'POST',
            //     body: comment.stringify()
            // })
        }
    }

    render() {
        return (
            <form>
        <textarea
            className="textarea"
            placeholder="Type a message"
            cols="35"
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            value={this.state.comment}>
          </textarea>
            </form>
        )
    }
}

export default CommentBox

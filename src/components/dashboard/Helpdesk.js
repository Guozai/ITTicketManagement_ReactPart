import React, { Component } from 'react';
import { apiurl } from '../../helpers/constants';
import { Table, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import firebase from 'firebase';

class Helpdesk extends Component {
    state = {
        tickets: [],
        selectedTicket: null,
        // Tech user list
        techUsers: [],
        selectedTech: null,
        // priority list
        priorityLevels: [],
        selectedPriority: null,
        // escalation list
        escalationLevels: [],
        selectedEscalation: null
    }

    /* Once component has mounted, fetch from API + firebase */
    componentDidMount() {
        /* Fetch all tickets and check which tickets have
            an assigned tech
         */
        fetch(apiurl + '/api/tickets')
            .then((response) => response.json())
            .then((responseJson) => {
                const pendingTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].id).on('value', (snapshot) => {
                            pendingTickets.push(responseJson[ele]);

                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                    })
                }
                return pendingTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })

        /* Creates a firebase listener which will automatically
            update the list of tech users every time a new tech
            registers into the system
         */
        const users = firebase.database().ref('user/')
        users.on('value', (snapshot) => {
            const tempTech = [];
            for(const ele in snapshot.val()) {
                if(snapshot.val()[ele].type === 'tech') {
                    tempTech.push(snapshot.val()[ele]);
                }
            }
            this.setState({
                techUsers: tempTech
            });
        })
    }

    /* Toggle the ticket dialog */
    ticketDetailsClick = (ticket) => {
        const { selectedTicket } = this.state;
        this.setState({
            selectedTicket: (selectedTicket !== null && selectedTicket.id === ticket.id ? null : ticket)
        });
    }

    /* Close button for dialog */
    closeDialogClick = () => {
        this.setState({
            selectedTicket: null
        })
    }

    /* Update the selected tech from dropdown box */
    handleTechChange = (e) => {
        this.setState({
            selectedTech: e.target.value
        });
    }

    /* Click assign button */
    assignTicketToTech = () => {
        if(this.state.selectedTech === null) {
            return;
        }

        /* Add assigned ticket+tech into database*/
        const data = {};
        data['ticket/' + this.state.selectedTicket.id] = {
            ticket_id: this.state.selectedTicket.id,
            user_id: this.state.selectedTech // stored Tech ID
        };
        firebase.database().ref().update(data)
        alert('Tech successfully assigned to ticket!');
        window.location.reload();
    }

    /* Update the selected priority from priority dropdown list */
    handlePriorityChange = (e) => {
        this.setState({
            selectedPriority: e.target.value
        });
    }

    /* Update the selected escalation level from escalation dropdown list */
    handleEscalationChange = (e) => {
        this.setState({
            selectedEscalation: e.target.value
        });
    }

    /* Set priority and escalation */
    setPriorityEscalation = () => {
        if(this.state.selectedPriority === null && this.state.selectedEscalation === null) {
            return;
        }

        /* Add assigned priority and escalation into database */
        const data = {};
        data['ticket/' + this.state.selectedTicket.id] = {
          ticket_id: this.state.selectedTicket.id,
          priority: this.state.selectedPriority, // set priority
          escalation: this.state.selectedEscalation // set escalation level
        };
        firebase.database().ref().update(data)
        alert('Priority and escalation successfully assigned!');
        window.location.reload()
    }

    /* Render the page! */
    render () {
        const vm = this
        const { selectedTicket, tickets, techUsers, priorityLevels, escalationLevels } = this.state

        return (
            <div>
                <Row>
                    <Col md={(selectedTicket !== null ? 7 : 12)}>
                        <h1>Pending Tickets</h1>
                        {tickets.length < 1 && (
                            <p className="alert alert-info">There are no tickets to display.</p>
                        )}
                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket, i) => (
                                <tr key={i}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.customer.name}</td>
                                    <td>
                                        <Button bsStyle={vm.state.selectedTicket !== null && vm.state.selectedTicket.id === ticket.id ? 'success' : 'info'} onClick={() => vm.ticketDetailsClick(ticket)}>More Details</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>
                    {selectedTicket !== null && (
                        <Col md={5}>
                            <Jumbotron style={{padding: 10}}>
                                <Button block bsStyle="danger" onClick={this.closeDialogClick}>Close Dialog</Button>
                                <h3 className="text-uppercase">Ticket Details</h3>
                                <p><b>ID: </b>{selectedTicket.id}</p>
                                <p><b>Description: </b><br/>{selectedTicket.description}</p>
                                <p><b>: </b>{selectedTicket.comment}</p>
                                <div>
                                    <hr/>
                                    <h3 className="text-uppercase">Set Priority</h3>
                                    <select className="form-control" onChange={this.handlePriorityChange} defaultValue="-1">
                                        <option value="-1" defaultValue disabled>Set a priority for the ticket</option>
                                        <option value="1">Priority 1</option>
                                        <option value="2">Priority 2</option>
                                        <option value="3">Priority 3</option>
                                    </select>

                                    <h3 className="text-uppercase">Set Escalation</h3>
                                    <select className="form-control" onChange={this.handleEscalationChange} defaultValue="-1">
                                        <option value="-1" defaultValue disabled>Set an escalation level for the ticket</option>
                                        <option value="1">Escalation Level 1</option>
                                        <option value="2">Escalation Level 2</option>
                                        <option value="3">Escalation Level 3</option>
                                    </select>

                                    <div className="clearfix"><br/>
                                        <Button className="pull-right" bsStyle="success" onClick={this.setPriorityEscalation}>Set</Button>
                                    </div>
                                </div>
                                {techUsers.length > 0 && (
                                    <div>
                                        <hr/>
                                        <h3 className="text-uppercase">Assign to tech</h3>
                                        <select className="form-control" onChange={this.handleTechChange} defaultValue="-1">
                                            <option value="-1" defaultValue disabled>Select a tech user</option>
                                            {techUsers.map((user, i) => (
                                                <option key={i} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>

                                        <div className="clearfix"><br/>
                                            <Button className="pull-right" bsStyle="success" onClick={this.assignTicketToTech}>Assign</Button>
                                        </div>
                                    </div>
                                )
                                }
                            </Jumbotron>
                        </Col>
                    )}
                </Row>
            </div>
        );
    }
}

export default Helpdesk;
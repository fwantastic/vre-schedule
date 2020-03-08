import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            directions: [],
            directionsDropdownOpen: false,
            selectedDirectionName: null,
            fromStations: [],
            fromStationsDropdownOpen: false,
            selectedFromStation: null,
            fromTrains: [],
            fromTrainsDropdownOpen: false,
            selectedFromTrain: null,
            toStations: [],
            toStationsDropdownOpen: false,
            selectedToStation: null,
            toTrain: null
        };
    }

    componentDidMount() {
        this.findDirections();
    }

    findDirections() {
        this.findFredericksburgNorthboundSchedule();
        this.findFredericksburgSouthboundSchedule();
        this.findManassasNorthboundSchedule();
        this.findManassasSouthboundSchedule();
    }

    findFredericksburgNorthboundSchedule() {
        this.findSchedule('Fredericksburg Line - Northbound', 'https://www.vre.org/service/schedule/schedule-data/fredericksburg-line-northbound/', 14);
    }

    findFredericksburgSouthboundSchedule() {
        this.findSchedule('Fredericksburg Line - Southbound', 'https://www.vre.org/service/schedule/schedule-data/fredericksburg-line-southbound/', 14);
    }

    findManassasNorthboundSchedule() {
        this.findSchedule('Manassas Line - Northbound', 'https://www.vre.org/service/schedule/schedule-data/manassas-line-northbound/', 11);
    }

    findManassasSouthboundSchedule() {
        this.findSchedule('Manassas Line - Southbound', 'https://www.vre.org/service/schedule/schedule-data/manassas-line-southbound/', 11);
    }

    findSchedule(directionName, url, columnCount) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

        fetch(proxyUrl + url)
            .then(result => result.text())
            .then(
                (result) => {
                    let cleansedResult = this.cleanseText(result);
                    //   console.log(test);

                    let lines = cleansedResult.match(/[^\r\n]+/g);

                    let data = [];
                    let x = -1;

                    for (var i = 0; i < lines.length; i++) {

                        if (i % columnCount === 0) {
                            data.push([]);
                            x++;
                        }

                        let value = this.findValue(lines[i]).trim();
                        data[x].push(value);
                    }

                    console.log(data);

                    // let rowRegex =/<th(.*?)<\/th>/g;
                    // let matches = result.match(rowRegex);
                    // console.log(matches);

                    let direction = {
                        label: directionName,
                        schedule: data
                    };

                    this.state.directions.push(direction);

                    this.setState({
                        isLoaded: true
                    });

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log('error' + error);
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    findValue(line) {
        let regexp = /(?:>)(.*)(?:<)/;
        let match = line.match(regexp);

        while (match && match[1].match(regexp)) {
            match = match[1].match(regexp);
        }

        return match[1];
    }

    cleanseText(text) {
        return text.substring(text.indexOf('<table>'), text.indexOf('</table>'))
            .replace(/<table>(?:\r\n|\r|\n)/g, '')
            .replace(/<thead>(?:\r\n|\r|\n)/g, '')
            .replace(/<\/thead>(?:\r\n|\r|\n)/g, '')
            .replace(/<tr>(?:\r\n|\r|\n)/g, '')
            .replace(/<\/tr>(?:\r\n|\r|\n)/g, '')
            .replace(/<tbody>(?:\r\n|\r|\n)/g, '')
            .replace(/<\/tbody>(?:\r\n|\r|\n)/g, '')
            .replace(/<\/time> a.m./g, ' a.m.</time>')
            .replace(/<\/time>&nbsp;a.m./g, ' a.m.</time>')
            .replace(/<\/time> p.m./g, ' p.m.</time>')
            .replace(/<\/time>&nbsp;p.m./g, ' p.m.</time>')
            .replace(/a.m./g, 'AM')
            .replace(/p.m./g, 'PM')
            .replace(/<span class="sched-badge sched-badge-secondary">L<\/span>/g, '')
            .replace(/<span class="sched-badge">B<\/span>/g, '')
            .replace(/<span class="sched-badge">S<\/span>/g, 'S')
            .replace(/&nbsp;/g, '')
            .replace(/<a href="\/service\/amtrak\/">/g, '')
            .replace(/<\/a><\/td>/g, '</td>');
    }

    toggleDirectionsDropdown = () => {
        this.setState({
            directionsDropdownOpen: !this.state.directionsDropdownOpen
        });
    }

    selectDirectionName = (e) => {
        this.setState({
            selectedDirectionName: e.currentTarget.textContent
        },
            () => { this.populateFromStations(); });
    }

    populateFromStations = () => {
        let fromStations = this.state.directions
            .filter(direction => direction.label === this.state.selectedDirectionName)
            .map(direction => direction.schedule[0].slice(1))[0];
        this.setState({
            fromStations: fromStations,
            selectedFromStation: null
        });
    }

    toggleFromStationsDropdown = () => {
        this.setState({
            fromStationsDropdownOpen: !this.state.fromStationsDropdownOpen
        });
    }

    selectFromStation = (e) => {
        this.setState({
            selectedFromStation: parseInt(e.currentTarget.id)
        },
            () => { this.populateFromTrains(); });
    }

    populateFromTrains = () => {
        let allTrains = this.state.directions
            .filter(direction => direction.label === this.state.selectedDirectionName)
            .map(direction => direction.schedule)[0];

        let fromTrains = [];
        for (let i = 1; i < allTrains.length; i++) {
            fromTrains.push('[' + allTrains[i][0].padStart(11, ' ') + '] ' + allTrains[i][this.state.selectedFromStation]);
        }
        this.setState({
            fromTrains: fromTrains
        });
    }

    toggleFromTrainsDropdown = () => {
        this.setState({
            fromTrainsDropdownOpen: !this.state.fromTrainsDropdownOpen
        });
    }

    selectFromTrain = (e) => {
        this.setState({
            selectedFromTrain: parseInt(e.currentTarget.id)
        },
        () => { this.populateToStations(); });
    }

    populateToStations = () => {
        let toStations = this.state.directions
            .filter(direction => direction.label === this.state.selectedDirectionName)
            .map(direction => direction.schedule[0].slice(1))[0]
            .slice(this.state.selectedFromStation + 1);

        this.setState({
            toStations: toStations
        });
    }

    toggleToStationsDropdown = () => {
        this.setState({
            toStationsDropdownOpen: !this.state.toStationsDropdownOpen
        });
    }

    selectToStation = (e) => {
        this.setState({
            selectedToStation: parseInt(e.currentTarget.id)
        });
    }

    render() {
        const { error, isLoaded, directions, directionsDropdownOpen, fromStations, fromStationsDropdownOpen, fromTrains, fromTrainsDropdownOpen, toStations, toStationsDropdownOpen } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <div>
                        direction:
                        <ButtonDropdown isOpen={directionsDropdownOpen} toggle={this.toggleDirectionsDropdown}>
                            <DropdownToggle caret color="primary">
                                {this.state.selectedDirectionName}
                            </DropdownToggle>
                            <DropdownMenu>
                                {directions.map(direction => (
                                    <DropdownItem id={direction.label} key={direction.label} onClick={this.selectDirectionName}>{direction.label}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </ButtonDropdown>
                    </div>

                    <div>
                        from station:
                        <ButtonDropdown isOpen={fromStationsDropdownOpen} toggle={this.toggleFromStationsDropdown}>
                            <DropdownToggle caret>
                                {fromStations[this.state.selectedFromStation]}
                            </DropdownToggle>
                            <DropdownMenu>
                                {fromStations.map((station, index) => (
                                    <DropdownItem id={index} key={index} onClick={this.selectFromStation}>{station}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </ButtonDropdown>
                    </div>

                    <div>
                        from train:
                        <ButtonDropdown isOpen={fromTrainsDropdownOpen} toggle={this.toggleFromTrainsDropdown}>
                            <DropdownToggle caret>
                                {fromTrains[this.state.selectedFromTrain]}
                            </DropdownToggle>
                            <DropdownMenu>
                                {fromTrains.map((train, index) => (
                                    <DropdownItem id={index} key={index} onClick={this.selectFromTrain}><pre>{train}</pre></DropdownItem>
                                ))}
                            </DropdownMenu>
                        </ButtonDropdown>
                    </div>

                    <div>
                        to station:
                        <ButtonDropdown isOpen={toStationsDropdownOpen} toggle={this.toggleToStationsDropdown}>
                            <DropdownToggle caret color="success">
                                {toStations[this.state.selectedToStation]}
                            </DropdownToggle>
                            <DropdownMenu>
                                {toStations.map((station, index) => (
                                    <DropdownItem id={index} key={index} onClick={this.selectToStation}>{station}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </ButtonDropdown>
                    </div>
                </div>
            );
        }
    }
}

export default HomePage;

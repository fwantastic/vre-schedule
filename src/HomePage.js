import React from 'react';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            schedule: [],
            directions: [],
            fromStations: [],
            fromTrains: [],
            toStations: [],
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

                        if (i % columnCount == 0) {
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

    render() {
        const { error, isLoaded, directions } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {directions.map(direction => (
                        <li key={direction.label}>
                            {direction.label}
                        </li>
                    ))}
                </ul>
            );
        }
    }
}

export default HomePage;

import { MainConnectionInterface } from './interfaces/connectiosn.interface';

class Connections {
    private toConnect: Array<MainConnectionInterface>;

    constructor(connections: Array<MainConnectionInterface>) {
        this.toConnect = connections;
    }

    init(): void {
        for (const conn of this.toConnect) {
            conn.main_start();
        }
    }
}

export default Connections;

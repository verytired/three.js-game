class SceneData {

    private _data;

    constructor(data) {
        this._data = data;
    }

    public getData(index) {
        return this._data[index];
    }
}
import React, { Component } from "react";
import axios from "axios";

class Karyawan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKaryawan: [],
      edit: false,
      dataPost: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
      },
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.sendDataForm = this.sendDataForm.bind(this);
  }

  reloadData() {
    axios.get("http://localhost:3004/data-karyawan/").then((res) => {
      this.setState({
        dataKaryawan: res.data,
        edit: false,
      });
    });
  }

  handleRemove(e) {
    console.log(e.target.value);
    axios.delete(`http://localhost:3004/data-karyawan/${e.target.value}`).then((res) => this.reloadData());
  }

  inputChange(e) {
    let newDataPost = { ...this.state.dataPost };
    if (this.state.edit === false) {
      newDataPost["id"] = new Date().getTime();
    }

    newDataPost[e.target.name] = e.target.value;
    this.setState(
      {
        dataPost: newDataPost,
      },
      () => console.log(this.state.dataPost)
    );
  }

  sendDataForm() {
    if (this.state.edit === false) {
      axios.post(`http://localhost:3004/data-karyawan`, this.state.dataPost).then(() => {
        this.reloadData();
        this.clearData();
      });
    } else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost).then(() => {
        this.reloadData();
        this.clearData();
      });
    }
  }

  clearData = () => {
    let newDataPost = { ...this.state.dataPost };
    newDataPost["id"] = "";
    newDataPost["jabatan"] = "";
    newDataPost["nama_karyawan"] = "";
    newDataPost["jenis_kelamin"] = "";
    newDataPost["tanggal_lahir"] = "";

    this.setState({
      dataPost: newDataPost,
    });
  };

  componentDidMount() {
    this.reloadData();
  }
  componentDidUpdate() {
    this.inputChange = this.inputChange.bind(this);
  }

  getDataId = (e) => {
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`).then((res) => {
      this.setState({
        dataPost: res.data,
        edit: true,
      });
    });
  };

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center", color: "white", backgroundColor: "#8B4513" }}>Data Karyawan</h1>
        <br></br>
        <input type="text" name="nama_karyawan" value={this.state.dataPost.nama_karyawan} placeholder="Masukan Nama karyawan" onChange={(e) => this.inputChange(e)} />
        <input type="text" name="jabatan" value={this.state.dataPost.jabatan} placeholder="Masukan Jabatan" onChange={(e) => this.inputChange(e)} style={{ margin: "0 10px" }} />
        <input type="text" name="jenis_kelamin" value={this.state.dataPost.jenis_kelamin} placeholder="Masukan Jenis Kelamin" onChange={(e) => this.inputChange(e)} />
        <input type="date" name="tanggal_lahir" value={this.state.dataPost.tanggal_lahir} placeholder="yyy/mm/dd" onChange={(e) => this.inputChange(e)} style={{ margin: "0 10px" }} />
        <button type="submit" onClick={this.sendDataForm} style={{ color: "white", backgroundColor: "blue", width: "150px" }}>
          Save Data
        </button>
        {this.state.dataKaryawan.map((dt, index) => {
          return (
            <div key={index}>
              <div style={{ border: "2px solid black", width: "25vw", margin: "10px", padding: "10px", borderRadius: "2%" }}>
                <p>Nama : {dt.nama_karyawan}</p>
                <p>Jabatan : {dt.jabatan}</p>
                <p>Jenis Kelamin : {dt.jenis_kelamin}</p>
                <p>Tanggal Lahir : {dt.tanggal_lahir}</p>
                <button value={dt.id} onClick={this.handleRemove} style={{ color: "white", backgroundColor: "red", width: "100px", marginRight: "5px" }}>
                  Delete
                </button>
                <button value={dt.id} onClick={this.getDataId} style={{ color: "white", backgroundColor: "green", width: "100px" }}>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Karyawan;

function salvarNome() {
    var paciente = document.getElementById("pacienteNome").value;
    localStorage.setItem("paciente", paciente);
    window.location.replace("index.html");
}
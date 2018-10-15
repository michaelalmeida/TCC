function salvarNome() {
    var paciente = document.getElementById("pacienteNome").value;
    localStorage.setItem("paciente", paciente);
}
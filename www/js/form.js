function salvarNome() {
    var paciente = document.getElementById("pacienteNome").value;
    localStorage.setItem("paciente", paciente);
    document.getElementById("form").style.display = "none";
}
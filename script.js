import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://uolcgntsyzkkcqlfeowo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbGNnbnRzeXpra2NxbGZlb3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1OTE4MjksImV4cCI6MjAyNzE2NzgyOX0._DlhbNBrF4kXqu9dWqWRwqtobL7Bp_xv1WbNEiloGBg";

const supabase = createClient(supabaseUrl, supabaseKey);

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phoneNumber);
}

function validateCRMNumber(crmNumber) {
    const crmRegex = /^\d{1,}$/; 
    return crmRegex.test(crmNumber);
}

function validateModal() {
    const estado = document.getElementById("Estado").value;
    if (!estado) {
        alert("Por favor, selecione o estado antes de enviar o formulário.");
        return false;
    }
    return true;
}

function displayModal() {
    document.getElementById('modal').style.display = 'block';
}

document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateModal()) {
        return;
    }

    const telefone = document.getElementById("Telefone").value;
    const estado = document.getElementById("Estado").value;

    if (!validatePhoneNumber(telefone)) {
        alert("Por favor, insira um número de telefone válido.");
        return;
    }

    const { data: existingPhones, error: existingErrorPhone } = await supabase
        .from("usuarios")
        .select("*")
        .eq("Telefone", telefone.replace(/\D/g, ''))
        .eq("Estado", estado);

    if (existingErrorPhone) {
        console.error("Erro ao verificar o telefone:", existingErrorPhone.message);
        return;
    }

    if (existingPhones.length > 0) {
        alert("Este telefone já está cadastrado para o estado selecionado. Por favor, insira um telefone diferente.");
        return;
    }

    const nome = document.getElementById("Nome_Completo").value;
    const email = document.getElementById("Email").value;
    let crm = document.getElementById("CRM").value;

    if (!validateEmail(email)) {
        alert("Por favor, insira um endereço de email válido.");
        return;
    }

    if (!validateCRMNumber(crm)) {
        alert("Por favor, insira um número de CRM válido.");
        return;
    }

    displayModal();
});

document.getElementById("confirmYesBtn").addEventListener("click", async function () {
    const nome = document.getElementById("Nome_Completo").value;
    const email = document.getElementById("Email").value;
    const telefone = document.getElementById("Telefone").value;
    let crm = document.getElementById("CRM").value; 
    const estado = document.getElementById("Estado").value;
  
    const formData = {
        Nome_Completo: nome,
        Email: email,
        Telefone: telefone.replace(/\D/g, ''),
        CRM: crm.replace(/\D/g, ''),
        Estado: estado
    };

    const { data: existingCRMs, error: existingError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("CRM", formData.CRM)
        .eq("Estado", estado);

    if (existingError) {
        console.error("Erro ao verificar o CRM:", existingError.message);
        return;
    }

    if (existingCRMs.length > 0) {
        alert("Este CRM já está cadastrado para o estado selecionado. Por favor, insira um CRM diferente.");
        return;
    }

    const { data, error } = await supabase.from("usuarios").insert([formData]);

    if (error) {
        console.error("Erro ao inserir os dados:", error.message);
    } else {
        console.log("Dados inseridos com sucesso:", data);
        alert("Cadastro realizado com sucesso!");
        console.log("Dados inseridos:", formData);
    }

    document.getElementById("myForm").reset();
    document.getElementById('modal').style.display = 'none'; 
});

document.getElementById("CRM").addEventListener("input", function (event) {
    this.value = this.value.replace(/\D/g, ''); 
});

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById('modal').style.display = 'none';
});

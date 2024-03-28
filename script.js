import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://uolcgntsyzkkcqlfeowo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbGNnbnRzeXpra2NxbGZlb3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1OTE4MjksImV4cCI6MjAyNzE2NzgyOX0._DlhbNBrF4kXqu9dWqWRwqtobL7Bp_xv1WbNEiloGBg";

const supabase = createClient(supabaseUrl, supabaseKey);

function validateName(name) {
    const nameRegex = /^[a-zA-ZÀ-ú]{2,}(?:\s[a-zA-ZÀ-ú]+)+$/;
    return nameRegex.test(name);
}

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


function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + ' ' + match[3] + '-' + match[4];
    }

    return phoneNumber;
}

document.getElementById("CRM").addEventListener("input", function (event) {
    this.value = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
});

document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("Nome_Completo").value;
    const email = document.getElementById("Email").value;
    const telefone = document.getElementById("Telefone").value;
    let crm = document.getElementById("CRM").value; // Permitir apenas números
    const estado = document.getElementById("Estado").value;

    if (!validateName(nome)) {
        alert("Por favor, insira pelo menos dois nomes no campo Nome.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Por favor, insira um endereço de email válido.");
        return;
    }

    if (!validatePhoneNumber(telefone)) {
        alert("Por favor, insira um número de telefone válido (de 10 a 11 dígitos).");
        return;
    }

    if (!validateCRMNumber(crm)) {
        alert("Por favor, insira um número de CRM válido (até 6 dígitos).");
        return;
    }

    // Remover caracteres não numéricos do CRM
    crm = crm.replace(/\D/g, '');

    const { data: existingCRMs, error: existingError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("CRM", crm)
      .eq("Estado", estado);

    if (existingError) {
      console.error("Erro ao verificar o CRM:", existingError.message);
      return;
    }

    if (existingCRMs.length > 0) {
      alert("Este CRM já está cadastrado para o estado selecionado. Por favor, insira um CRM diferente.");
      return;
    }

    const formData = {
      Nome_Completo: nome,
      Email: email,
      Telefone: telefone.replace(/\D/g, ''),
      CRM: crm,
      Estado: estado
    };

    console.log("Dados do Formulário:", formData);

    const { data, error } = await supabase.from("usuarios").insert([formData]);

    if (error) {
        console.error("Erro ao inserir os dados:", error.message);
    } else {
        console.log("Dados inseridos com sucesso:", data);
        alert("Cadastro realizado com sucesso!");
    }

    event.target.reset();
});

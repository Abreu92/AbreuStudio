<?php
// Define que este ficheiro devolve respostas no formato JSON (perfeito para o JavaScript)
header('Content-Type: application/json');

// Chama o ficheiro de conexão que criaste anteriormente
require 'conexao.php';

// Recebe os dados enviados pelo JavaScript (fetch)
$dados = json_decode(file_get_contents("php://input"), true);

// Verifica se existe uma ação definida
if (!isset($dados['action'])) {
    echo json_encode(['success' => false, 'message' => 'Nenhuma ação definida.']);
    exit;
}

$action = $dados['action'];

// ==========================================
// 1. LÓGICA DE REGISTO (CRIAR CONTA)
// ==========================================
if ($action === 'register') {
    $nome = $dados['name'];
    $email = $dados['email'];
    $password = $dados['password'];

    try {
        // 1.1 Verificar se o email já existe
        $stmt = $conn->prepare("SELECT id FROM utilizadores WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Este email já está registado!']);
            exit;
        }

        // 1.2 Encriptar a password por segurança
        $password_encriptada = password_hash($password, PASSWORD_DEFAULT);

        // 1.3 Inserir na base de dados
        $stmt = $conn->prepare("INSERT INTO utilizadores (nome, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$nome, $email, $password_encriptada]);

        echo json_encode(['success' => true, 'message' => 'Conta criada com sucesso!']);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro na base de dados: ' . $e->getMessage()]);
    }
}

// ==========================================
// 2. LÓGICA DE LOGIN
// ==========================================
elseif ($action === 'login') {
    $email = $dados['email'];
    $password = $dados['password'];

    try {
        // 2.1 Procurar o utilizador pelo email
        $stmt = $conn->prepare("SELECT id, nome, password, role FROM utilizadores WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // 2.2 Verificar se o utilizador existe e se a password bate certo com a encriptação
        if ($user && password_verify($password, $user['password'])) {
            
            // Login com sucesso! (Não devolvemos a password para o JS por segurança)
            echo json_encode([
                'success' => true, 
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['nome'],
                    'role' => $user['role']
                ]
            ]);

        } else {
            echo json_encode(['success' => false, 'message' => 'Email ou password incorretos.']);
        }
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro na base de dados: ' . $e->getMessage()]);
    }
}
?>
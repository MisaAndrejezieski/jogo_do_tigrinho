# Importação das bibliotecas necessárias
import socket
import os
import threading
import mimetypes
import psycopg2
import json

def handle_request(client_socket):
    """
    Manipula as requisições HTTP recebidas dos clientes
    
    Args:
        client_socket: Socket do cliente conectado
    """
    try:
        # Lê os dados da requisição HTTP
        request_data = client_socket.recv(1024).decode()

        # Separa a primeira linha da requisição para obter o método e o caminho
        method, path, _ = request_data.split(None, 2)
        headers, body = request_data.split('\r\n\r\n', 1)

        if method == 'GET':
            # Redireciona '/' para 'index.html'
            if path == '/':
                path = '/index.html'

            # Constrói o caminho absoluto do arquivo
            full_path = os.getcwd() + path

            # Verifica se o arquivo existe
            if os.path.isfile(full_path):
                # Determina o tipo MIME do arquivo
                mime_type, _ = mimetypes.guess_type(full_path)
                response = 'HTTP/1.1 200 OK\n'
                if mime_type:
                    response += f'Content-Type: {mime_type}\n'
                response += '\n'
                
                # Lê e envia o arquivo
                with open(full_path, 'rb') as file:
                    response = response.encode() + file.read()
            else:
                # Arquivo não encontrado
                response = 'HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\n404 Not Found'.encode()

            # Envia a resposta
            client_socket.sendall(response)

        elif method == 'POST':
            if path == '/submit':
                print("ENTREI NO POST")
                try:
                    # Tenta parsear o JSON do corpo da requisição
                    body_data = json.loads(body)
                except json.JSONDecodeError:
                    response = 'HTTP/1.1 400 Bad Request\r\n\r\nInvalid JSON'
                    client_socket.sendall(response.encode())
                    return

                try:
                    # Conecta ao banco de dados PostgreSQL
                    conn_string = "host='192.168.0.5' dbname='postest' user='postgres'  password='6792010'"
                    conn = psycopg2.connect(conn_string)
                    print("Conexão com o banco de dados estabelecida com sucesso!")

                    # Insere os dados na tabela 'post'
                    cursor = conn.cursor()
                    cursor.execute(
                        "INSERT INTO post (nome, email, msg) VALUES (%s, %s, %s)",
                        (body_data['nome'], body_data['email'], body_data['msg'])
                    )
                    conn.commit()
                    cursor.close()
                    conn.close()

                    # Envia resposta de sucesso
                    response = 'HTTP/1.1 200 OK\nContent-Type: text/plain\n\nDados enviados com sucesso!'
                    client_socket.sendall(response.encode())
                except Exception as e:
                    # Erro na conexão com o banco
                    print("Erro ao conectar ao banco de dados:", e)
                    response = 'HTTP/1.1 500 Internal Server Error\r\n\r\nDatabase connection failed'
                    client_socket.sendall(response.encode())
                    return
            else:
                response = 'HTTP/1.1 400 Bad Request\r\n\r\nInvalid JSON'
        else:
            # Método HTTP não suportado
            response = 'HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\n404 Not Found'
            client_socket.sendall(response.encode())

    except Exception as e:
        print("Error:", e)
    finally:
        # Garante que o socket seja fechado
        client_socket.close()

def start_server():
    """
    Inicia o servidor HTTP na porta 8080
    """
    # Cria o socket do servidor
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('0.0.0.0', 8080))
    server_socket.listen()
    print('Server listening on port 8080...')

    try:
        while True:
            # Aceita novas conexões
            client_socket, client_address = server_socket.accept()
            print(f'Client connected: {client_address}')
            
            # Cria uma nova thread para cada cliente
            client_handler = threading.Thread(target=handle_request, args=(client_socket,))
            client_handler.start()
    except KeyboardInterrupt:
        print('Server shutting down...')
    finally:
        server_socket.close()

if __name__ == '__main__':
    start_server()
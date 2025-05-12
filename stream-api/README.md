# 🎥 Servidor de Streaming com MJPEG e WebRTC

Este projeto cria uma API REST em Python que permite iniciar e parar transmissões de vídeo utilizando dois formatos:

- 📸 **MJPEG via HTTP** (ideal para dispositivos com baixo desempenho, como Raspberry Pi Zero 2 W)
- 📡 **WebRTC** (para transmissões em tempo real com suporte a áudio e vídeo)

---

## ⚙️ Requisitos

- Python 3.7+
- Pip
- OpenCV
- Flask
- [aiortc](https://github.com/aiortc/aiortc)

---

## 🧪 Instalação

### 1. Clone o projeto

```bash
git clone 
cd video_stream_api
```

2. Crie e ative um ambiente virtual
```bash
python3 -m venv venv
source venv/bin/activate
```
3. Instale as dependências
```bash
sudo apt install libgl1-mesa-glx libgl1-mesa-dev
pip install -r requirements.txt
```

## 🚀 Como usar

### 📡 Iniciar streaming MJPEG
```bash
curl -X POST http://<ip-do-pi>:8080/start-stream?type=mjpeg
```
Acesse no navegador:

```lua
http://<ip-do-pi>:8080/video
```
### 🔌 Iniciar sessão WebRTC
```bash
curl -X POST http://<ip-do-pi>:8080/start-stream?type=webrtc
Você receberá a URL para envio da oferta SDP (/offer).
```
### ❌ Parar qualquer streaming
```bash
curl -X POST http://<ip-do-pi>:8080/stop-stream
```
### 📁 Estrutura do Projeto
```graphql
video_stream_api/
├── app.py              # API Flask com endpoints
├── webrtc_server.py    # Lógica de vídeo WebRTC
├── requirements.txt    # Dependências do projeto
```
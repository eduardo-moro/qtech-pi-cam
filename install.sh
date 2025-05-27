#!/bin/bash
echo "$(tput setaf 7)"
echo "$(tput setaf 1) ██████╗ $(tput setaf 7)████████╗███████╗ ██████╗██╗  ██╗      ██████╗ ██╗       ██████╗ █████╗ ███╗   ███╗$(tput sgr0)"
echo "$(tput setaf 1)██╔═══██╗$(tput setaf 7)╚══██╔══╝██╔════╝██╔════╝██║  ██║      ██╔══██╗██║      ██╔════╝██╔══██╗████╗ ████║$(tput sgr0)"
echo "$(tput setaf 1)██║   ██║$(tput setaf 7)   ██║   █████╗  ██║     ███████║█████╗██████╔╝██║█████╗██║     ███████║██╔████╔██║$(tput sgr0)"
echo "$(tput setaf 1)██║▄▄ ██║$(tput setaf 7)   ██║   ██╔══╝  ██║     ██╔══██║╚════╝██╔═══╝ ██║╚════╝██║     ██╔══██║██║╚██╔╝██║$(tput sgr0)"
echo "$(tput setaf 1)╚██████╔╝$(tput setaf 7)   ██║   ███████╗╚██████╗██║  ██║      ██║     ██║      ╚██████╗██║  ██║██║ ╚═╝ ██║$(tput sgr0)"
echo "$(tput setaf 1) ╚══▀▀═╝ $(tput setaf 7)   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝      ╚═╝     ╚═╝       ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝$(tput sgr0)"
echo ""               $(tput sgr0)     

echo ""                                                                 

echo "$(tput setaf 7)"
echo " █████╗ ██████╗ ████████╗    ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗     "
echo "██╔══██╗██╔══██╗╚══██╔══╝    ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║     "
echo "███████║██████╔╝   ██║       ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║     "
echo "██╔══██║██╔═══╝    ██║       ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║     "
echo "██║  ██║██║        ██║       ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗"
echo "╚═╝  ╚═╝╚═╝        ╚═╝       ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝"
echo "$(tput sgr0)"

# Helper function for error handling
fail_if_error() {
    if [ $? -ne 0 ]; then
        echo "$(tput setaf 1)[ERROR] $1$(tput sgr0)"
        exit 1
    fi
}

# Example usage:
# some_command
# fail_if_error "Description of what failed"

# Update system and install dependencies
sudo apt update && sudo apt upgrade -y
fail_if_error "System update/upgrade failed"
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    libgl1-mesa-glx \
    libgl1-mesa-dev \
    ffmpeg \
    libportaudio2 \
    nginx \
    libcap-dev \
    hostapd \
    dnsmasq \
    iptables \
    iptables-persistent \
    wireless-tools \
    rfkill 
fail_if_error "Dependency installation failed"

# Install nvm
curl -o nvm-install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
fail_if_error "Failed to download nvm"
chmod +x nvm-install.sh
bash ./nvm-install.sh
fail_if_error "Failed to install nvm"

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js using nvm
nvm install 20.16.0
fail_if_error "Failed to install Node.js"
nvm use 20.16.0
fail_if_error "Failed to use Node.js version"
nvm alias default 20.16.0
fail_if_error "Failed to set Node.js default alias"

# Verify Node.js and npm installation
node -v >/dev/null 2>&1
fail_if_error "Node.js not installed"
npm -v >/dev/null 2>&1
fail_if_error "npm not installed"

# Set up Python virtual environment and dependencies
cd /home/quadritech/stream-api || { echo "[ERROR] stream-api directory missing"; exit 1; }
sudo rm -rf .venv
python3 -m venv .venv
fail_if_error "Failed to create Python virtual environment"
./.venv/bin/pip install -r /home/quadritech/stream-api/requirements.txt
fail_if_error "Failed to install Python requirements"

# Build React frontend
cd /home/quadritech/stream-frontend || { echo "[ERROR] stream-frontend directory missing"; exit 1; }
sudo npm install
fail_if_error "Failed to install React dependencies"
npm run build
fail_if_error "Failed to build React frontend"
if [ ! -f "/home/quadritech/stream-frontend/build/index.html" ]; then
    echo "[ERROR] React build failed! Missing index.html"
    exit 1
fi

# --- Networking configuration ---
sudo sed -i '/interface wlan0/,/nohook wpa_supplicant/d' /etc/dhcpcd.conf
fail_if_error "Failed to clean up wlan0 config"
sudo rm -f /etc/dnsmasq.conf /etc/hostapd/hostapd.conf

sudo systemctl stop wpa_supplicant || true
sudo systemctl disable wpa_supplicant || true
sudo systemctl mask wpa_supplicant || true
sudo systemctl stop systemd-resolved || true
sudo systemctl disable systemd-resolved || true

sudo iw reg set BR
fail_if_error "Failed to set regulatory domain"
sudo sed -i 's/REGDOMAIN=.*/REGDOMAIN=BR/' /etc/default/crda || true

sudo tee -a /etc/dhcpcd.conf <<EOT
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
EOT
fail_if_error "Failed to configure static IP"

sudo tee /etc/systemd/system/create-wlan0.service <<EOT
[Unit]
Description=Create wlan0 Access Point Interface
Before=network.target
After=sys-subsystem-net-devices-wlan0.device

[Service]
Type=oneshot
ExecStartPre=-/usr/sbin/iw dev wlan0 del
ExecStart=/usr/sbin/iw phy phy0 interface add wlan0 type __ap
ExecStartPost=/bin/ip link set wlan0 up
ExecStartPost=/bin/sleep 3
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOT
fail_if_error "Failed to create create-wlan0.service"

sudo tee /etc/hostapd/hostapd.conf <<EOT
interface=wlan0
driver=nl80211
ssid=quadritech-pi-cam
hw_mode=g
channel=6
country_code=BR
wpa=2
wpa_passphrase=quadritech
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP
rsn_pairwise=CCMP
auth_algs=1
macaddr_acl=0
EOT
fail_if_error "Failed to create hostapd.conf"

sudo sed -i 's|^#DAEMON_CONF=.*|DAEMON_CONF="/etc/hostapd/hostapd.conf"|' /etc/default/hostapd || true

sudo tee /etc/dnsmasq.conf <<EOT
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
dhcp-option=3,192.168.4.1
server=8.8.8.8
no-resolv
bind-interfaces
EOT
fail_if_error "Failed to create dnsmasq.conf"

sudo mkdir -p /etc/systemd/system/dnsmasq.service.d
sudo tee /etc/systemd/system/dnsmasq.service.d/override.conf <<EOT
[Unit]
After=create-wlan0.service hostapd.service
Requires=create-wlan0.service
EOT
fail_if_error "Failed to create dnsmasq.service.d override"

sudo sed -i 's/^#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward >/dev/null

sudo iptables -t nat -F
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
fail_if_error "Failed to configure iptables"
sudo iptables-save | sudo tee /etc/iptables/rules.v4 >/dev/null

sudo rfkill unblock wifi

sudo systemctl daemon-reload
fail_if_error "Failed to reload systemd"
sudo systemctl enable create-wlan0.service
fail_if_error "Failed to enable create-wlan0.service"
sudo systemctl enable hostapd.service
fail_if_error "Failed to enable hostapd.service"
sudo systemctl enable dnsmasq.service
fail_if_error "Failed to enable dnsmasq.service"

sudo ip link set wlan0 down
sudo systemctl restart dhcpcd
fail_if_error "Failed to restart dhcpcd"

# Move systemd services and Nginx config
sudo mv /home/quadritech/api.service /etc/systemd/system/
fail_if_error "Failed to move api.service"
sudo mv /home/quadritech/default /etc/nginx/sites-available/
fail_if_error "Failed to move nginx default config"
sudo chown -R quadritech:www-data /home/quadritech/stream-frontend
fail_if_error "Failed to chown stream-frontend"
sudo chmod 755 /home/quadritech/stream-frontend
sudo find /home/quadritech/stream-frontend/build -type d -exec chmod 755 {} \;
sudo find /home/quadritech/stream-frontend/build -type f -exec chmod 644 {} \;

sudo systemctl daemon-reload
fail_if_error "Failed to reload systemd (final)"

sudo systemctl unmask hostapd
fail_if_error "Failed to unmask hostapd"

sudo systemctl enable nginx.service
fail_if_error "Failed to enable nginx.service"
sudo systemctl enable api.service
fail_if_error "Failed to enable api.service"

echo "$(tput setaf 7)"
echo "Setup complete! Rebooting in 5 seconds..."
sleep 5
tput sgr0
sudo reboot
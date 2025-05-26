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

# Update system and install dependencies
sudo apt update && sudo apt upgrade -y
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

echo "$(tput setaf 7)"
echo "███╗   ██╗ ██████╗ ██████╗ ███████╗"
echo "████╗  ██║██╔═══██╗██╔══██╗██╔════╝"
echo "██╔██╗ ██║██║   ██║██║  ██║█████╗  "
echo "██║╚██╗██║██║   ██║██║  ██║██╔══╝  "
echo "██║ ╚████║╚██████╔╝██████╔╝███████╗"
echo "╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝"
echo "$(tput sgr0)"

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_20.16.x | sudo -E bash -
sudo apt install -y nodejs

echo "$(tput setaf 7)"
echo "██████╗ ██╗   ██╗████████╗██╗  ██╗ ██████╗ ███╗   ██╗"
echo "██╔══██╗╚██╗ ██╔╝╚══██╔══╝██║  ██║██╔═══██╗████╗  ██║"
echo "██████╔╝ ╚████╔╝    ██║   ███████║██║   ██║██╔██╗ ██║"
echo "██╔═══╝   ╚██╔╝     ██║   ██╔══██║██║   ██║██║╚██╗██║"
echo "██║        ██║      ██║   ██║  ██║╚██████╔╝██║ ╚████║"
echo "╚═╝        ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝"
echo "$(tput sgr0)"


# Set up Python virtual environment and dependencies
cd /home/quadritech/stream-api || { echo "stream-api directory missing"; exit 1; }
rm -rf .venv
echo "$(tput setaf 7)Setting up Python virtual environment...$(tput sgr0)"
python3 -m venv .venv
/home/quadritech/stream-api/.venv/bin/pip install -r /home/quadritech/stream-api/requirements.txt

echo "$(tput setaf 7)"
echo "███████╗██████╗  ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗██████╗ "
echo "██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║██╔══██╗"
echo "█████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║██║  ██║"
echo "██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║██║  ██║"
echo "██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║██████╔╝"
echo "╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝ "
echo "$(tput sgr0)"

cat > /home/quadritech/stream-frontend/.env <<EOL
REACT_APP_API_URL=http://192.168.4.1/api
GENERATE_SOURCEMAP=false
EOL

# Build React frontend
cd /home/quadritech/stream-frontend || { echo "stream-frontend directory missing"; exit 1; }
echo "$(tput setaf 2)Installing React dependencies...$(tput sgr0)"
sudo npm install
npm run build

# Check build
if [ ! -f "/home/quadritech/stream-frontend/build/index.html" ]; then
    echo "React build failed! Missing index.html"
    exit 1
fi

echo "$(tput setaf 7)"
echo " █████╗  ██████╗ ██████╗███████╗███████╗███████╗    ██████╗  ██████╗ ██╗███╗   ██╗████████╗"
echo "██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝    ██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝"
echo "███████║██║     ██║     █████╗  ███████╗███████╗    ██████╔╝██║   ██║██║██╔██╗ ██║   ██║   "
echo "██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║    ██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║   "
echo "██║  ██║╚██████╗╚██████╗███████╗███████║███████║    ██║     ╚██████╔╝██║██║ ╚████║   ██║   "
echo "╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝    ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝   "
echo "$(tput sgr0)"

# ======================
# NETWORKING CONFIGURATION
# ======================

echo "Configuring Access Point..."

# --- Cleanup Previous Config ---
# Remove any existing wlan0 configuration
sudo sed -i '/interface wlan0/,/nohook wpa_supplicant/d' /etc/dhcpcd.conf
sudo rm -f /etc/dnsmasq.conf /etc/hostapd/hostapd.conf

# --- Disable Conflicting Services ---
sudo systemctl stop wpa_supplicant || true
sudo systemctl disable wpa_supplicant || true
sudo systemctl mask wpa_supplicant || true
sudo systemctl stop systemd-resolved || true
sudo systemctl disable systemd-resolved || true

# --- Set Regulatory Domain ---
sudo iw reg set BR  # Set to Brazil, change to your country code
sudo sed -i 's/REGDOMAIN=.*/REGDOMAIN=BR/' /etc/default/crda

# --- Static IP Configuration ---
sudo tee -a /etc/dhcpcd.conf <<EOT
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
EOT

# --- HostAPD Configuration ---
# Create AP interface service (persistent creation)
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

# HostAPD configuration file
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

# Enable HostAPD configuration
sudo sed -i 's|^#DAEMON_CONF=.*|DAEMON_CONF="/etc/hostapd/hostapd.conf"|' /etc/default/hostapd

# --- DNSMASQ Configuration ---
sudo tee /etc/dnsmasq.conf <<EOT
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
dhcp-option=3,192.168.4.1
server=8.8.8.8
no-resolv
bind-interfaces
EOT

# --- Service Dependencies ---
# Create service dependencies to ensure proper startup order
sudo mkdir -p /etc/systemd/system/dnsmasq.service.d
sudo tee /etc/systemd/system/dnsmasq.service.d/override.conf <<EOT
[Unit]
After=create-wlan0.service hostapd.service
Requires=create-wlan0.service
EOT

# --- IP Forwarding & NAT ---
sudo sed -i 's/^#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward >/dev/null

# Configure iptables (simplified NAT)
sudo iptables -t nat -F
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  # Change eth0 to your outbound interface
sudo iptables-save | sudo tee /etc/iptables/rules.v4 >/dev/null

# --- Service Management ---
# Unblock WiFi if soft-blocked
sudo rfkill unblock wifi

# Enable and start services in proper order
sudo systemctl daemon-reload
sudo systemctl enable create-wlan0.service
sudo systemctl enable hostapd
sudo systemctl enable dnsmasq

# --- Final Network Configuration ---
# Ensure wlan0 is down before services start it
sudo ip link set wlan0 down
sudo systemctl restart dhcpcd

echo "Networking configuration complete!"

echo "$(tput setaf 7)"
echo "███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗    ██████╗ "
echo "██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║    ██╔══██╗"
echo "███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║    ██║  ██║"
echo "╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║    ██║  ██║"
echo "███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║    ██████╔╝"
echo "╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝    ╚═════╝ "
echo "$(tput sgr0)"


# Move systemd services and Nginx config
sudo mv /home/quadritech/api.service /etc/systemd/system/
sudo mv /home/quadritech/default /etc/nginx/sites-available/
sudo chown -R quadritech:www-data /home/quadritech/stream-frontend
sudo chmod 755 /home/quadritech/stream-frontend
sudo find /home/quadritech/stream-frontend/build -type d -exec chmod 755 {} \;
sudo find /home/quadritech/stream-frontend/build -type f -exec chmod 644 {} \;

# Reload systemd to pick up new service files
sudo systemctl daemon-reload

# Unmask hostapd to allow it to start
sudo systemctl unmask hostapd

# Enable and start AP services first
sudo systemctl enable create-wlan0.service hostapd.service dnsmasq.service

# Enable and start Nginx and API
sudo systemctl enable nginx.service api.service


echo "$(tput setaf 7)"
echo "██████╗ ███████╗██╗      ██████╗  █████╗ ██████╗ ██╗███╗   ██╗ ██████╗ "
echo "██╔══██╗██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝ "
echo "██████╔╝█████╗  ██║     ██║   ██║███████║██║  ██║██║██╔██╗ ██║██║  ███╗"
echo "██╔══██╗██╔══╝  ██║     ██║   ██║██╔══██║██║  ██║██║██║╚██╗██║██║   ██║"
echo "██║  ██║███████╗███████╗╚██████╔╝██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝"
echo "╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ "
echo "$(tput sgr0)"


echo "$(tput setaf 7)"
echo "Setup complete! Rebooting in 5 seconds..."
sleep 5
sudo reboo$(tput sgr0)t
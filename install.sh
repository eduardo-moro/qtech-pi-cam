#!/bin/bash

echo ""
echo " █████╗ ██████╗ ████████╗    ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗     "
echo "██╔══██╗██╔══██╗╚══██╔══╝    ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║     "
echo "███████║██████╔╝   ██║       ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║     "
echo "██╔══██║██╔═══╝    ██║       ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║     "
echo "██║  ██║██║        ██║       ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗"
echo "╚═╝  ╚═╝╚═╝        ╚═╝       ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝"
echo ""

# Update system and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv git \
libgl1-mesa-glx libgl1-mesa-dev ffmpeg libportaudio2 nginx libcap-dev hostapd dnsmasq

echo ""
echo "███╗   ██╗ ██████╗ ██████╗ ███████╗"
echo "████╗  ██║██╔═══██╗██╔══██╗██╔════╝"
echo "██╔██╗ ██║██║   ██║██║  ██║█████╗  "
echo "██║╚██╗██║██║   ██║██║  ██║██╔══╝  "
echo "██║ ╚████║╚██████╔╝██████╔╝███████╗"
echo "╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝"
echo ""

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

echo ""
echo "██████╗ ██╗   ██╗████████╗██╗  ██╗ ██████╗ ███╗   ██╗"
echo "██╔══██╗╚██╗ ██╔╝╚══██╔══╝██║  ██║██╔═══██╗████╗  ██║"
echo "██████╔╝ ╚████╔╝    ██║   ███████║██║   ██║██╔██╗ ██║"
echo "██╔═══╝   ╚██╔╝     ██║   ██╔══██║██║   ██║██║╚██╗██║"
echo "██║        ██║      ██║   ██║  ██║╚██████╔╝██║ ╚████║"
echo "╚═╝        ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝"
echo ""


# Set up Python virtual environment and dependencies
cd /home/quadritech/stream-api || { echo "stream-api directory missing"; exit 1; }
rm -rf .venv
python3 -m venv .venv
/home/quadritech/stream-api/.venv/bin/pip install -r /home/quadritech/stream-api/requirements.txt

echo ""
echo "███████╗██████╗  ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗██████╗ "
echo "██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║██╔══██╗"
echo "█████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║██║  ██║"
echo "██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║██║  ██║"
echo "██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║██████╔╝"
echo "╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝ "
echo ""


# Build React frontend
cd /home/quadritech/stream-frontend || { echo "stream-frontend directory missing"; exit 1; }
sudo npm install
npm run build

echo ""
echo " █████╗  ██████╗ ██████╗███████╗███████╗███████╗    ██████╗  ██████╗ ██╗███╗   ██╗████████╗"
echo "██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝    ██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝"
echo "███████║██║     ██║     █████╗  ███████╗███████╗    ██████╔╝██║   ██║██║██╔██╗ ██║   ██║   "
echo "██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║    ██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║   "
echo "██║  ██║╚██████╗╚██████╗███████╗███████║███████║    ██║     ╚██████╔╝██║██║ ╚████║   ██║   "
echo "╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝    ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝   "
echo ""

# Configure static IP for wlan0 (ensure no duplicates in dhcpcd.conf)
sudo tee -a /etc/dhcpcd.conf >/dev/null <<EOT
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
EOT

# Create hostapd config with proper WPA2 settings
sudo tee /etc/hostapd/hostapd.conf >/dev/null <<EOT
interface=wlan0
ssid=quadritech-pi-cam
hw_mode=g
channel=6
country_code=BR
wpa=2
wpa_passphrase=quadritech
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP
rsn_pairwise=CCMP
beacon_int=100
auth_algs=1
wmm_enabled=0
macaddr_acl=0
EOT

# Point hostapd to config file
sudo sed -i 's|^#DAEMON_CONF=.*|DAEMON_CONF="/etc/hostapd/hostapd.conf"|' /etc/default/hostapd

# Configure dnsmasq
sudo tee /etc/dnsmasq.conf >/dev/null <<EOT
interface=wlan0
bind-interfaces
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
server=8.8.8.8
server=8.8.4.4
EOT

# Enable IP forwarding
sudo sed -i 's/^#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf

# Configure NAT with correct outbound interface
OUTBOUND_IFACE=$(ip link | grep -oP 'eth0|usb0' | head -1)  # Auto-detect interface
sudo iptables -t nat -A POSTROUTING -o $OUTBOUND_IFACE -j MASQUERADE
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"

# Add iptables restore to rc.local (properly before exit 0)
sudo sed -i '/^exit 0/i iptables-restore < /etc/iptables.ipv4.nat' /etc/rc.local

# Disable IPv6
sudo tee -a /etc/sysctl.conf >/dev/null <<EOT
net.ipv6.conf.wlan0.disable_ipv6=1
net.ipv6.conf.all.disable_ipv6=1
EOT


echo ""
echo "███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗    ██████╗ "
echo "██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║    ██╔══██╗"
echo "███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║    ██║  ██║"
echo "╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║    ██║  ██║"
echo "███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║    ██████╔╝"
echo "╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝    ╚═════╝ "
echo ""


# Move systemd services and Nginx config
sudo mv /home/quadritech/api.service /etc/systemd/system/
sudo mv /home/quadritech/default /etc/nginx/sites-available/
sudo chmod 755 /home/quadritech
sudo chown -R quadritech:www-data /home/quadritech/stream-frontend/build
sudo chmod -R 755 /home/quadritech/stream-frontend/build

# Reload systemd and enable/start services
sudo systemctl daemon-reload
sudo systemctl enable nginx api.service
sudo systemctl start nginx api.service
sudo systemctl unmask hostapd
sudo systemctl enable hostapd dnsmasq



echo ""
echo "██████╗ ███████╗██╗      ██████╗  █████╗ ██████╗ ██╗███╗   ██╗ ██████╗ "
echo "██╔══██╗██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝ "
echo "██████╔╝█████╗  ██║     ██║   ██║███████║██║  ██║██║██╔██╗ ██║██║  ███╗"
echo "██╔══██╗██╔══╝  ██║     ██║   ██║██╔══██║██║  ██║██║██║╚██╗██║██║   ██║"
echo "██║  ██║███████╗███████╗╚██████╔╝██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝"
echo "╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ "
echo ""


echo ""
echo "Setup complete! Rebooting in 5 seconds..."
sleep 5
sudo reboot
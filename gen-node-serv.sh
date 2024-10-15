#!/bin/bash

APP_NAME="amr-dev.info"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Find the node executable path
which node &> /dev/null
if [ $? -eq 0 ]; then
  node_path=$(which node)
else
  echo "Error: Node.js not found. Please install Node.js."
  exit 1
fi

# Function to generate the service file content
generate_service_file() {
  cat <<EOF > $SCRIPT_DIR/$APP_NAME.service
[Unit]
Description=$APP_NAME Node.js express application
After=network.target

[Service]
User=$USER
WorkingDirectory=$SCRIPT_DIR/
ExecStart=$node_path $SCRIPT_DIR/
Restart=always
RestartSec=3
EnvironmentFile=$SCRIPT_DIR/.env

[Install]
WantedBy=multi-user.target
EOF
}

# Main script logic
generate_service_file

sudo cp $SCRIPT_DIR/$APP_NAME.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $APP_NAME
sudo systemctl start $APP_NAME


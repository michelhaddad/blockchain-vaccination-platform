## Prerequisites

* Docker  (v19.03.0+)
* docker-compose (v1.24.1+)  
* Node.js (v10.16.3)
* npm (6.9.0)

The following are necessary only if you want to build Fabricbeat yourself. If you intend to use the Docker image ([balazsprehoda/fabricbeat](https://hub.docker.com/repository/docker/balazsprehoda/fabricbeat/general)) or the pre-compiled executable, you can skip them.

* python (2.7) 
* virtualenv (16.7.0+)  
* Go (v1.12.7+)  

The instructions below have been tested on a Ubuntu 20.04 virtual machine with at least 4GB RAM:

### Golang

Install [`goenv`](https://github.com/syndbg/goenv/blob/master/INSTALL.md) tool for installing the appropriate version of Go:

To install `goenv`:
```
$ git clone https://github.com/syndbg/goenv.git ~/.goenv
$ echo 'export GOENV_ROOT="$HOME/.goenv"' >> ~/.bashrc
$ echo 'export PATH="$GOENV_ROOT/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(goenv init -)"' >> ~/.bashrc
$ echo 'export PATH="$GOROOT/bin:$PATH"' >> ~/.bashrc
$ echo 'export PATH="$GOPATH/bin:$PATH"' >> ~/.bashrc
```

Restart the shell, install Go and set this version to be used globally:
```
$ goenv install 1.12.7
$ goenv global 1.12.7
```

To verify installation, run
```
$ go version
```

Restart the shell, create GOPATH
```
$ echo $GOPATH
$ mkdir $GOPATH -p
```


### Docker
Use these commands to install the latest version of Docker:
```
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

To verify installation, run
```
$ docker --version
$ sudo docker run hello-world
```

We should add our user to the docker group:
```
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
$ newgrp docker
```

Then see if we can run the hello world container without sudo:
```
$ docker run hello-world
```

### Docker Compose
To install Docker Compose, run these commands:
```
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```
To verify installation, run
```
$ docker-compose --version
```

### Install [`nodenv`](https://github.com/nodenv/nodenv) and Node.js

(Node is not needed for building the fabricbeat agent)

`nodenv` is used to install an appropriate Node.js version.

```
# install gcc and make
$ sudo apt-get install gcc make
$ git clone https://github.com/nodenv/nodenv.git ~/.nodenv
$ cd ~/.nodenv && src/configure && make -C src
# For bash only
$ echo 'export PATH="$HOME/.nodenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(nodenv init -)"' >> ~/.bashrc
```

Restart the shell and install [`node-build`](https://github.com/nodenv/node-build) plugin:

```
$ mkdir -p "$(nodenv root)"/plugins
$ git clone https://github.com/nodenv/node-build.git "$(nodenv root)"/plugins/node-build
```

Install Nodejs and upgrade `npm`:
```
$ nodenv install 10.16.3
$ nodenv global 10.16.3
$ sudo apt-get install npm
```

We can check the installed version by running
```
$ node -v
$ npm -v
```

### Install MongoDB:

Import the public key used by the package management system
```
$ wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```


Create a list file for MongoDB (Please choose the command that matches your Ubuntu version)
```
# For Ubuntu 20.04
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
# For Ubuntu 18.04
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
# For Ubuntu 16.04
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

Install the MongoDB packages
```
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```

Run MongoDB Community Edition

To run and manage your mongod process, you will be using your operating system's built-in init system. Recent versions of Linux tend to use systemd (which uses the systemctl command), while older versions of Linux tend to use System V init (which uses the service command).

If you are unsure which init system your platform uses, run the following command:
```
ps --no-headers -o comm 1
```

systemd
```
sudo systemctl start mongod
# Verify that MongoDB has started successfully
sudo systemctl status mongod
#  ensure that MongoDB will start following a system reboot (optional)
sudo systemctl enable mongod
```

System V init
```
sudo service mongod start
# Verify that MongoDB has started successfully
sudo service mongod status
```

If you're having trouble installing MongoDB, you may want to check this installation guide: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

### Optional

### Python

Install python 2.7:

```
$ sudo apt-get install python2
$ echo alias python='python2' >> ~/.bashrc
```

Reopen the shell and check that the alias is set properly
```
$ python --version
```

### Virtualenv

```
$ sudo apt install virtualenv
```

FROM python:3.9.2

# Add the external tasks directory into /tasks
ADD locust-tasks /locust-tasks

# Upgrade pip
RUN pip install --upgrade pip

# Install the required dependencies via pip
RUN pip install -r /locust-tasks/requirements.txt

# Expose the required Locust ports
EXPOSE 5557 5558 8089

# Set script to be executable
RUN chmod 755 /locust-tasks/run.sh

# Start Locust using LOCUS_OPTS environment variable
ENTRYPOINT ["/locust-tasks/run.sh"] 
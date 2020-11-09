FROM docker.pkg.github.com/biigle/core/app:arm32v6 as intermediate

FROM arm32v6/php:7.2-rc-alpine
MAINTAINER Martin Zurowietz <martin@cebitec.uni-bielefeld.de>

RUN apk add --no-cache \
        openssl \
        postgresql-dev \
        libxml2-dev \
        libzip-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        json \
        zip \
        fileinfo \
        exif \
        soap \
        pcntl

ARG PHPREDIS_VERSION=5.0.0
RUN curl -L -o /tmp/redis.tar.gz https://github.com/phpredis/phpredis/archive/${PHPREDIS_VERSION}.tar.gz \
    && tar -xzf /tmp/redis.tar.gz \
    && rm /tmp/redis.tar.gz \
    && mkdir -p /usr/src/php/ext \
    && mv phpredis-${PHPREDIS_VERSION} /usr/src/php/ext/redis \
    && docker-php-ext-install redis

ENV PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:${PKG_CONFIG_PATH}"
# Install vips from source because the apk package does not work with the vips PHP
# extension. Install libvips and the vips PHP extension in one go so the *-dev
# dependencies are reused.
ARG LIBVIPS_VERSION=8.8.4
ARG PHP_VIPS_EXT_VERSION=1.0.11
RUN apk add --no-cache --virtual .build-deps \
        autoconf \
        automake \
        build-base \
        glib-dev \
        tiff-dev \
        libjpeg-turbo-dev \
        libgsf-dev \
        libpng-dev \
        expat-dev \
    && apk add --no-cache \
        glib \
        tiff \
        libjpeg-turbo \
        libgsf \
        libpng \
        expat \
    && cd /tmp \
    && curl -L https://github.com/libvips/libvips/releases/download/v${LIBVIPS_VERSION}/vips-${LIBVIPS_VERSION}.tar.gz -o vips-${LIBVIPS_VERSION}.tar.gz \
    && tar -xzf vips-${LIBVIPS_VERSION}.tar.gz \
    && cd vips-${LIBVIPS_VERSION} \
    && ./configure \
        --without-python \
        --enable-debug=no \
        --disable-dependency-tracking \
        --disable-static \
    && make -j $(nproc) \
    && make -s install-strip \
    && cd /tmp \
    && curl -L https://github.com/libvips/php-vips-ext/raw/master/vips-${PHP_VIPS_EXT_VERSION}.tgz -o  vips-${PHP_VIPS_EXT_VERSION}.tgz \
    && echo '' | pecl install vips-${PHP_VIPS_EXT_VERSION}.tgz \
    && docker-php-ext-enable vips \
    && rm -r /tmp/* \
    && apk del --purge .build-deps \
    && rm -rf /var/cache/apk/*

RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-numpy \
    py3-pillow \
    py3-scipy

RUN apk add --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted \
    py3-scikit-learn

RUN apk add --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted \
    py3-matplotlib

# Set this library path to the Python modules are linked correctly.
# See: https://github.com/python-pillow/Pillow/issues/1763#issuecomment-204252397
ENV LIBRARY_PATH=/lib:/usr/lib
# Install Python dependencies. Note that these also depend on some image processing libs
# that were installed along with vips.
RUN apk add --no-cache --virtual .build-deps \
        py3-pip \
    && pip3 install --no-cache-dir \
        PyExcelerate==0.6.7 \
    && apk del --purge .build-deps \
    && rm -rf /var/cache/apk/*

# Just copy from intermediate biigle/app so the installation of dependencies with
# Composer doesn't have to run twice.
COPY --from=intermediate /var/www /var/www

WORKDIR /var/www

# This is required to run php artisan tinker in the worker container. Do this for
# debugging purposes.
RUN mkdir -p /.config/psysh && chmod o+w /.config/psysh

ARG BIIGLE_VERSION
ENV BIIGLE_VERSION=${BIIGLE_VERSION}

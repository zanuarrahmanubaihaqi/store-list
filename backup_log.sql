PGDMP     .    0        
        y            postgres    9.6.15    9.6.19 	    ?	           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            ?	           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            ?	           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            &           1259    79216    PI_maintenance_log    TABLE     (  CREATE TABLE public."PI_maintenance_log" (
    id integer DEFAULT nextval('public.pi_maintenance_log_seq'::regclass) NOT NULL,
    id_report bigint,
    user_sumber bigint,
    user_tujuan bigint,
    pesan character varying,
    tanggal date,
    report character varying,
    dilihat bigint
);
 (   DROP TABLE public."PI_maintenance_log";
       public         postgres    false            %           1259    79214    PI_maintenance_log_id_seq    SEQUENCE     ?   CREATE SEQUENCE public."PI_maintenance_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public."PI_maintenance_log_id_seq";
       public       postgres    false    294            ?	           0    0    PI_maintenance_log_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public."PI_maintenance_log_id_seq" OWNED BY public."PI_maintenance_log".id;
            public       postgres    false    293            ?	          0    79216    PI_maintenance_log 
   TABLE DATA               x   COPY public."PI_maintenance_log" (id, id_report, user_sumber, user_tujuan, pesan, tanggal, report, dilihat) FROM stdin;
    public       postgres    false    294   ?	       ?	           0    0    PI_maintenance_log_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public."PI_maintenance_log_id_seq"', 1, false);
            public       postgres    false    293            0	           2606    79224 *   PI_maintenance_log PI_maintenance_log_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public."PI_maintenance_log"
    ADD CONSTRAINT "PI_maintenance_log_pkey" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public."PI_maintenance_log" DROP CONSTRAINT "PI_maintenance_log_pkey";
       public         postgres    false    294    294            ?	   %  x????j?0е???=l?^Z?p)iW%?	j?~?N??wL?@R0h?Õ?H?I?V??	a??æ?;>bo???8}N5_⶷#/%SB??(*e??1RL??H????v#??????%?YԔ?8????B??w?<???U?ZJX?e|?P??hJI3??N[??z?-_N??`????????TCQëe??I??ډyp??n?*?UT???9V]?Շ[jU%#?0??ͧn>	L?@}??M?T?0oP?)gЍN0???S)?? ???1df,?ݎv???(???     